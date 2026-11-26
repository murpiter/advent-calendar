import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('Gingerbread counts sweet days in both languages', () => {
  const ruDays = ru.themes.gingerbread?.subtitle;
  assert.deepEqual([24, 25, 31].map((days) => ruDays?.(days)), [
    '24 сладких дня до праздника',
    '25 сладких дней до праздника',
    '31 сладкий день до праздника',
  ]);
  assert.equal(en.themes.gingerbread?.subtitle?.(25), '25 sweet days until the holidays');
});

test('The page opens in English before the app picks a language', () => {
  const head = readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
  assert.match(head, /<html lang="en">/);
  assert.ok(head.includes(`<title>${en.pageTitle}</title>`));
  assert.ok(head.includes(`content="${en.description}"`));
  assert.match(head, /manifest-%THEME%-en\.webmanifest/);
});
