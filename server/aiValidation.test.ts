import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  asHttpUrl,
  asScore,
  asText,
  asTextList,
  normalizeHistorical,
  normalizeSources,
  normalizeTimeline,
} from './aiValidation.ts';

test('asText trims, collapses whitespace and rejects non-strings', () => {
  assert.equal(asText('  hello \n   world  '), 'hello world');
  assert.equal(asText('   '), undefined);
  assert.equal(asText(42), undefined);
  assert.equal(asText('a'.repeat(50), 10), 'a'.repeat(10));
});

test('asTextList keeps only non-empty strings and caps the count', () => {
  assert.deepEqual(asTextList(['a', '', 3, null, ' b ']), ['a', 'b']);
  assert.deepEqual(asTextList('not an array'), []);
  assert.equal(asTextList(Array.from({ length: 30 }, (_, i) => `p${i}`), 5).length, 5);
});

test('asHttpUrl accepts only http(s) URLs', () => {
  assert.equal(asHttpUrl('https://example.com/a'), 'https://example.com/a');
  assert.equal(asHttpUrl('javascript:alert(1)'), undefined);
  assert.equal(asHttpUrl('ftp://example.com'), undefined);
  assert.equal(asHttpUrl('not a url'), undefined);
  assert.equal(asHttpUrl(undefined), undefined);
});

test('asScore clamps to 0..100 and falls back on bad input', () => {
  assert.equal(asScore(150, 94), 100);
  assert.equal(asScore(-5, 94), 0);
  assert.equal(asScore('72', 94), 72);
  assert.equal(asScore('abc', 94), 94);
  assert.equal(asScore(undefined, 94), 94);
});

test('normalizeTimeline drops malformed items', () => {
  const out = normalizeTimeline([
    { time: '2026-01', event: 'Start' },
    { time: '', event: 'no time' },
    'junk',
    { time: '2026-02' },
  ]);
  assert.deepEqual(out, [{ time: '2026-01', event: 'Start' }]);
});

test('normalizeSources keeps safe urls and drops unsafe ones', () => {
  const out = normalizeSources([
    { name: 'Reuters', url: 'https://reuters.com/x' },
    { name: 'Bad', url: 'javascript:alert(1)' },
    'BBC News',
    { url: 'https://nameless.example' },
  ]);
  assert.deepEqual(out, [
    { name: 'Reuters', url: 'https://reuters.com/x' },
    { name: 'Bad' },
    { name: 'BBC News' },
  ]);
});

test('normalizeHistorical requires an event name and a quote', () => {
  assert.equal(normalizeHistorical({ eventName: 'X' }), undefined);
  assert.equal(normalizeHistorical(null), undefined);
  const ok = normalizeHistorical({
    eventName: 'Treaty',
    yearOrEra: '1648',
    similarity: 's',
    historicalLesson: 'l',
    quote: { text: 'Peace is possible.', author: 'Someone' },
  });
  assert.equal(ok?.quote.text, 'Peace is possible.');
  assert.equal(ok?.quote.sourceOrEra, undefined);
});
