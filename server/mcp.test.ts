import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  _filterAndSort,
  normalizeHours,
  normalizeKeywords,
  normalizeLimit,
  normalizeTopics,
  periodToHours,
  planSections,
  whenToken
} from './newsDigestService.ts';
import { MCP_TOOLS, handleRpc } from './mcpServer.ts';

const NOW = Date.UTC(2026, 9, 18, 12, 0, 0);
const hoursAgo = (h: number) => new Date(NOW - h * 3600 * 1000).toISOString();
const art = (n: number, title: string, publishedAt: string) => ({
  title,
  description: '',
  url: `https://example.com/${n}`,
  source: 'Example',
  publishedAt
});

test('normalizeTopics: accepts English aliases and rejects unknown or prototype keys', () => {
  assert.deepEqual(normalizeTopics(['Economy', 'tech', 'energiya', 'constructor']), ['energiya', 'iqtisodiyot', 'texnologiya']);
  assert.deepEqual(normalizeTopics(['__proto__', 'toString']), []);
});

test('normalizeKeywords: strips search operators and caps count and length', () => {
  assert.deepEqual(normalizeKeywords(['oil prices', 'site:evil.com when:1y']), ['oil prices', 'site evil com when 1y']);
  assert.deepEqual(normalizeKeywords(['"quoted" (x)']), ['quoted x']);
  assert.deepEqual(normalizeKeywords('not an array'), []);
  assert.deepEqual(normalizeKeywords([42, null, '  ']), []);
  assert.equal(normalizeKeywords(['a', 'b', 'c', 'd', 'e', 'f', 'g']).length, 5);
  assert.ok(normalizeKeywords(['x'.repeat(200)])[0].length <= 60);
  // Cyrillic and Korean interests survive.
  assert.deepEqual(normalizeKeywords(['нефть цены', '반도체']), ['нефть цены', '반도체']);
});

test('numeric inputs are clamped', () => {
  assert.equal(normalizeHours(5000, 24), 336);
  assert.equal(normalizeHours(-3, 24), 24);
  assert.equal(normalizeHours('abc', 24), 24);
  assert.equal(normalizeLimit(99, 5), 15);
  assert.equal(normalizeLimit(0, 5), 5);
});

test('period and time window helpers', () => {
  assert.equal(periodToHours('daily'), 24);
  assert.equal(periodToHours('weekly'), 168);
  assert.equal(periodToHours(undefined), 24);
  assert.equal(whenToken(24), 'when:24h');
  assert.equal(whenToken(168), 'when:7d');
});

test('planSections: one section per topic and keyword, default is general', () => {
  assert.deepEqual(planSections([], []), [{ label: 'umumiy', query: null }]);
  const plans = planSections(['energiya'], ['oil prices']);
  assert.deepEqual(plans.map(p => p.label), ['energiya', 'oil prices']);
  assert.equal(plans[1].query, '"oil prices"');
});

test('filterAndSort: drops old and duplicate items, newest first', () => {
  const list = [
    art(1, 'Old story', hoursAgo(80)),
    art(2, 'Fresh story', hoursAgo(2)),
    art(3, 'Fresh story', hoursAgo(1)),
    art(4, 'Newer story', hoursAgo(0.5))
  ];
  const out = _filterAndSort(list, 24, NOW);
  assert.deepEqual(out.map(a => a.url), ['https://example.com/4', 'https://example.com/2']);
});

test('MCP initialize negotiates the protocol version and advertises tools', async () => {
  const res: any = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26' } });
  assert.equal(res.result.protocolVersion, '2025-03-26');
  assert.ok(res.result.capabilities.tools);
  const fallback: any = await handleRpc({ jsonrpc: '2.0', id: 2, method: 'initialize', params: { protocolVersion: '1999-01-01' } });
  assert.equal(fallback.result.protocolVersion, '2025-06-18');
});

test('MCP tools/list returns every tool with a schema', async () => {
  const res: any = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  const names = res.result.tools.map((t: any) => t.name);
  assert.deepEqual(names, ['list_options', 'get_digest', 'get_latest_news', 'search_articles']);
  for (const tool of MCP_TOOLS) assert.equal(tool.inputSchema.type, 'object');
});

test('MCP notifications get no response, unknown requests get an error', async () => {
  assert.equal(await handleRpc({ jsonrpc: '2.0', method: 'notifications/initialized' }), null);
  const unknown: any = await handleRpc({ jsonrpc: '2.0', id: 7, method: 'nope/nothing' });
  assert.equal(unknown.error.code, -32601);
  const invalid: any = await handleRpc({ id: 8 } as any);
  assert.equal(invalid.error.code, -32600);
  const ping: any = await handleRpc({ jsonrpc: '2.0', id: 9, method: 'ping' });
  assert.deepEqual(ping.result, {});
});

test('MCP tools/call: list_options works, bad input is a tool error, unknown tool is a protocol error', async () => {
  const ok: any = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'list_options' } });
  const payload = JSON.parse(ok.result.content[0].text);
  assert.ok(payload.countries.includes('UZ'));
  assert.ok(payload.topics.includes('energiya'));

  const bad: any = await handleRpc({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'search_articles', arguments: { query: '!!!' } } });
  assert.equal(bad.result.isError, true);

  const unknown: any = await handleRpc({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'delete_everything' } });
  assert.equal(unknown.error.code, -32602);
});
