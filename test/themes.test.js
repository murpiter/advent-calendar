import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_THEME, THEMES, themeById } from '../src/themes/index.js';

test('a theme name that is not ours falls back to the default theme', () => {
  for (const name of ['constructor', 'toString', '__proto__', 'nope']) assert.equal(themeById(name), THEMES[DEFAULT_THEME]);
});
