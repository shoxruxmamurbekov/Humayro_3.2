import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timingSafeAdminCheck } from './security.ts';
import { normalizeCountry, normalizeTopics } from './newsroomService.ts';

test('admin token: exact match only', () => {
  assert.equal(timingSafeAdminCheck('s3cret-token', 's3cret-token'), true);
  assert.equal(timingSafeAdminCheck('s3cret-tokeN', 's3cret-token'), false);
  assert.equal(timingSafeAdminCheck('short', 's3cret-token'), false);
  assert.equal(timingSafeAdminCheck(undefined, 's3cret-token'), false);
  assert.equal(timingSafeAdminCheck(['a', 'b'], 's3cret-token'), false);
});

test('newsroom topics: prototype keys are rejected', () => {
  assert.deepEqual(normalizeTopics(['constructor', '__proto__', 'toString', 'hasOwnProperty']), []);
  assert.deepEqual(normalizeTopics(['energiya', 'energiya', 'nonsense']), ['energiya']);
});

test('newsroom country: unknown and prototype keys fall back to US', () => {
  assert.equal(normalizeCountry('constructor'), 'US');
  assert.equal(normalizeCountry('__proto__'), 'US');
  assert.equal(normalizeCountry(undefined), 'UZ');
});
