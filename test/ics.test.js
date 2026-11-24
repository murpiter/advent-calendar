import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { calendarFile } from '../src/domain/ics.js';

const event = (day, summary = `Door ${day}`) => ({ day, summary, description: 'https://example.org/' });

const build = (events, year = 2026) => calendarFile({
  name: 'Advent', year, events, uid: 'abc', stamp: new Date(Date.UTC(2026, 10, 24, 9, 30)),
});

const unfold = (text) => text.replace(/\r\n /g, '').split('\r\n');
const valueOf = (lines, key) => lines.filter((line) => line.startsWith(`${key}:`)).map((line) => line.slice(key.length + 1));

describe('calendar file', () => {
  test('one all-day event per door, the last one ending on the next day', () => {
    const lines = unfold(build(Array.from({ length: 31 }, (_, i) => event(i + 1))));
    assert.equal(valueOf(lines, 'DTSTART;VALUE=DATE').length, 31);
    assert.equal(valueOf(lines, 'DTSTART;VALUE=DATE')[0], '20261201');
    assert.equal(valueOf(lines, 'DTEND;VALUE=DATE').at(-1), '20270101');
    assert.equal(new Set(valueOf(lines, 'UID')).size, 31);
  });

  test('lines end with CRLF and stay within 75 bytes without splitting letters', () => {
    const long = 'Протереть люстру и светильники, разобрать ёлочные игрушки 🎄 '.repeat(4).trim();
    const text = build([event(1, long)]);
    assert.ok(text.endsWith('\r\n'));
    assert.ok(!/[^\r]\n/.test(text));
    for (const line of text.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75, line);
    assert.equal(valueOf(unfold(text), 'SUMMARY')[0], long.replaceAll(',', '\\,'));
  });

  test('task text cannot add lines or fields of its own', () => {
    const hostile = 'a;b,c\\d\r\nEND:VEVENT\nBEGIN:VALARM';
    const lines = unfold(build([event(1, hostile)]));
    assert.deepEqual(valueOf(lines, 'SUMMARY'), ['a\\;b\\,c\\\\d\\nEND:VEVENT\\nBEGIN:VALARM']);
    assert.equal(lines.filter((line) => line === 'END:VEVENT').length, 1);
    assert.ok(!lines.includes('BEGIN:VALARM'));
  });
});
