import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { fileName, parsePreset, serializePreset } from '../src/domain/preset.js';

const items = Array.from({ length: 25 }, (_, i) => `Дело ${i + 1}`);
items[0] = '</script><script>alert(1)</script>';
items[1] = 'line separator & <!-- comment';

const preset = {
  id: 'a1b2c3d4e5f6a7b8',
  theme: 'forest',
  title: 'Уборка',
  days: 25,
  items,
  assign: [...items].reverse(),
  unlocked: false,
  gift: null,
};

describe('saved file data', () => {
  test('cannot break out of its script tag and survives the round trip', () => {
    const text = serializePreset(preset);
    assert.doesNotMatch(text, /[<>  ]/);
    assert.deepEqual(parsePreset(text), preset);
  });

  const broken = {
    'not JSON': '{oops',
    'an order that is not the same list': serializePreset({ ...preset, assign: [...items.slice(1), 'другое'] }),
    'a wrong day count': serializePreset({ ...preset, days: 30 }),
    'a strange id': serializePreset({ ...preset, id: '../../etc' }),
  };
  for (const [name, text] of Object.entries(broken)) {
    test(`rejects ${name}`, () => assert.equal(parsePreset(text), null));
  }
});

describe('file name', () => {
  test('keeps a readable title and drops characters that are unsafe in file names', () => {
    assert.equal(fileName('Уборка: дом/дача <2027>?'), 'Уборка дом дача 2027.html');
  });

  test('falls back when nothing is left', () => assert.equal(fileName('///'), 'advent-calendar.html'));
});
