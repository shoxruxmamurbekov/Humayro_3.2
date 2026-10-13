import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Article } from '../src/types/index.ts';
import { assignArticles, ensureOpinionMarker, isNumberGrounded, parsePosts } from './newsroomService.ts';
import { NEWSROOM_PERSONAS } from './newsroomPersonas.ts';

const mk = (i: number, title: string, description: string): Article => ({
  id: String(i),
  title,
  description,
  url: `https://example.com/news/${i}`,
  source: 'Example',
  publishedAt: new Date(Date.UTC(2026, 0, 20 - i)).toISOString()
});

// Ordered newest first, as collectArticles() returns them.
const articles: Article[] = [
  mk(0, 'Energiya narxi oshdi', "Narx 150 mln so'm bo'ldi"),
  mk(1, 'Texnologiya yangiligi', 'Yangi model chiqdi'),
  mk(2, 'Siyosat sharhi', 'Hukumat qarori haqida'),
  mk(3, 'Fan yangiligi', 'Olimlar uzoq tadqiqotni yakunladi va natijalarni batafsil e’lon qildi, bu uzun tavsif'),
  mk(4, 'Iqtisodiyot xabari', 'Qisqa')
];

test('assignArticles: every agent gets a distinct article', () => {
  const assignment = assignArticles(articles, NEWSROOM_PERSONAS);
  const urls = [...assignment.values()].map(a => a.url);
  assert.equal(assignment.size, NEWSROOM_PERSONAS.length);
  assert.equal(new Set(urls).size, urls.length);
});

test('assignArticles: Tezkor gets the freshest article, Sekin the most detailed one', () => {
  const assignment = assignArticles(articles, NEWSROOM_PERSONAS);
  assert.equal(assignment.get('tezkor-xabarchi')?.url, articles[0].url);
  assert.equal(assignment.get('sekin-tahlilchi')?.url, articles[3].url);
});

test('isNumberGrounded: numbers must appear in the article text', () => {
  assert.equal(isNumberGrounded("Narx 150 mln so'm", articles[0]), true);
  assert.equal(isNumberGrounded('Narx 999 ming', articles[0]), false);
  assert.equal(isNumberGrounded('Hech qanday raqam yo\'q', articles[0]), true);
});

test('parsePosts: source is always the assigned article, invented facts and unknown agents are dropped', () => {
  const assignment = assignArticles(articles, NEWSROOM_PERSONAS);
  const raw = JSON.stringify({
    posts: [
      {
        agentId: 'tezkor-xabarchi',
        headline: 'Narx oshdi',
        facts: ["Narx 150 mln so'm", 'Narx 999 ming'],
        sourceUrls: ['https://evil.example.com'],
        analysis: 'Menimcha, bu muhim.',
        confidence: 'high'
      },
      { agentId: 'sekin-tahlilchi', headline: 'x', facts: ['Hajm 77 foiz'], analysis: '', confidence: 'low' },
      { agentId: 'unknown-agent', headline: 'y', facts: ['Fakt'], analysis: '', confidence: 'low' }
    ]
  });

  const posts = parsePosts(raw, assignment);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].agentId, 'tezkor-xabarchi');
  assert.deepEqual(posts[0].facts, ["Narx 150 mln so'm"]);
  assert.deepEqual(posts[0].sourceUrls, [articles[0].url]);
});

test('parsePosts: malformed model output yields no posts instead of throwing', () => {
  const assignment = assignArticles(articles, NEWSROOM_PERSONAS);
  assert.deepEqual(parsePosts('not json at all', assignment), []);
  assert.deepEqual(parsePosts('{"posts":"wrong"}', assignment), []);
});

test('ensureOpinionMarker: keeps an existing marker, adds one when missing', () => {
  assert.equal(ensureOpinionMarker("Menimcha, bu muhim.", 'uz'), 'Menimcha, bu muhim.');
  assert.equal(ensureOpinionMarker("Menimcha bu muhim", 'uz'), 'Menimcha bu muhim');
  // Apostrophe variants in Uzbek must match the same marker.
  assert.equal(ensureOpinionMarker("Tahlilimga koʻra, narx oshdi", 'uz'), "Tahlilimga koʻra, narx oshdi");
  assert.equal(ensureOpinionMarker('Narx oshdi', 'uz'), 'Menimcha, Narx oshdi');
  assert.equal(ensureOpinionMarker('Цена выросла', 'ru'), 'По моему мнению, Цена выросла');
  assert.equal(ensureOpinionMarker('The price rose', 'en'), 'In my view, The price rose');
  assert.equal(ensureOpinionMarker('Unknown lang', 'xx'), 'In my view, Unknown lang');
  assert.equal(ensureOpinionMarker('   ', 'uz'), '');
});

test('parsePosts: analysis always states that it is an opinion', () => {
  const assignment = assignArticles(articles, NEWSROOM_PERSONAS);
  const raw = JSON.stringify({
    posts: [{ agentId: 'tezkor-xabarchi', headline: 'Narx', facts: ["Narx 150 mln so'm"], analysis: "Narx tez oshdi", confidence: 'high' }]
  });
  const [post] = parsePosts(raw, assignment, 'uz');
  assert.equal(post.analysis, "Menimcha, Narx tez oshdi");
});
