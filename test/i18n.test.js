import assert from 'node:assert/strict';
import { test } from 'node:test';
import en from '../src/i18n/en.js';
import ru from '../src/i18n/ru.js';

function shape(value) {
  if (Array.isArray(value)) return `array:${value.length}`;
  if (typeof value !== 'object') return typeof value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])]));
}

test('English and Russian texts have the same keys and example sizes', () => {
  assert.deepEqual(shape(en), shape(ru));
});
