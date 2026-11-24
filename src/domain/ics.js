const MAX_LINE_BYTES = 75;
const DECEMBER = 11;
const encoder = new TextEncoder();

const CONTROL = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

const escapeText = (text) => text
  .replace(CONTROL, '')
  .replace(/\\/g, '\\\\')
  .replace(/;/g, '\\;')
  .replace(/,/g, '\\,')
  .replace(/\r\n|\r|\n/g, '\\n');

function fold(line) {
  const parts = [];
  let current = '';
  let size = 0;
  for (const char of line) {
    const bytes = encoder.encode(char).length;
    const limit = parts.length ? MAX_LINE_BYTES - 1 : MAX_LINE_BYTES;
    if (size + bytes > limit) {
      parts.push(current);
      current = '';
      size = 0;
    }
    current += char;
    size += bytes;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

const pad = (n) => String(n).padStart(2, '0');
const dateValue = (date) => `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
const decemberDay = (year, day) => dateValue(new Date(Date.UTC(year, DECEMBER, day)));
const stampValue = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const eventLines = ({ day, summary, description }, { year, uid, stamp }) => [
  'BEGIN:VEVENT',
  `UID:${uid}-${day}@advent-calendar`,
  `DTSTAMP:${stamp}`,
  `DTSTART;VALUE=DATE:${decemberDay(year, day)}`,
  `DTEND;VALUE=DATE:${decemberDay(year, day + 1)}`,
  `SUMMARY:${escapeText(summary)}`,
  `DESCRIPTION:${escapeText(description)}`,
  'TRANSP:TRANSPARENT',
  'END:VEVENT',
];

export function calendarFile({ name, year, events, uid, stamp }) {
  const context = { year, uid, stamp: stampValue(stamp) };
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//advent-calendar//EN',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${escapeText(name)}`,
    ...events.flatMap((event) => eventLines(event, context)),
    'END:VCALENDAR',
  ];
  return `${lines.map(fold).join('\r\n')}\r\n`;
}
