import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatCedis } from './api';

test('formats Ghana cedis from minor units', () => {
  assert.equal(formatCedis(35000), 'GH₵350');
  assert.equal(formatCedis(null), 'Price on request');
});
