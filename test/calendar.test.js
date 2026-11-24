import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { currentDay, doorState } from '../src/domain/calendar.js';

const on = (month, day) => new Date(2026, month, day, 12);

describe('currentDay', () => {
  const cases = [
    ['before December', on(10, 30), 25, 0],
    ['in February', on(1, 14), 31, 0],
    ['inside the season', on(11, 7), 24, 7],
    ['after a 24-day season', on(11, 28), 24, 24],
    ['late December of a 31-day season', on(11, 28), 31, 28],
    ['in January', on(0, 5), 25, 25],
  ];
  for (const [name, date, days, expected] of cases) {
    test(name, () => assert.equal(currentDay(date, days), expected));
  }
});

describe('doorState', () => {
  const strict = { today: 7, opened: [], unlocked: false };

  test('a past door is open', () => assert.equal(doorState(3, strict), 'open'));
  test('today\'s door is ready', () => assert.equal(doorState(7, strict), 'ready'));
  test('a future door is locked', () => assert.equal(doorState(8, strict), 'locked'));
  test('a future door is ready once the lock is lifted', () => {
    assert.equal(doorState(20, { ...strict, unlocked: true }), 'ready');
  });
  test('a future door opened without the lock stays open', () => {
    assert.equal(doorState(20, { ...strict, opened: [20], unlocked: true }), 'open');
  });
});
