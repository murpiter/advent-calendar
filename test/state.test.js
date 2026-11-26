import assert from 'node:assert/strict';
import { test } from 'node:test';
import ru from '../src/i18n/ru.js';
import { exampleItems, isExampleList } from '../src/state.js';

test('only a list of the user’s own tasks is worth asking about before the example replaces it', () => {
  assert.equal(isExampleList([], ru), true);
  assert.equal(isExampleList(exampleItems(ru, 24), ru), true);
  assert.equal(isExampleList([...exampleItems(ru, 3), 'Позвонить бабушке'], ru), false);
});
