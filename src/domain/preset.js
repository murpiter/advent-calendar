import { isGiftToken } from './gift.js';
import { LIMITS, clean, isCalendar, isLine, isObject } from './validate.js';

const ID_PATTERN = /^[a-f0-9]{16}$/;
const UNSAFE_IN_FILE_NAMES = /[\\/:*?"<>|\u0000-\u001F\u007F]+/g;
const HTML_SENSITIVE = { '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029' };

const sameTasks = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

const isGiftMark = (gift) => gift === null
  || (isObject(gift) && isLine(gift.from, LIMITS.from) && isGiftToken(gift.token));

const isPreset = (data) => isObject(data)
  && ID_PATTERN.test(data.id)
  && isCalendar(data)
  && Array.isArray(data.assign) && sameTasks(data.assign, data.items)
  && typeof data.unlocked === 'boolean'
  && isGiftMark(data.gift);

function normalize({ id, theme, title, days, items, assign, unlocked, gift }) {
  return {
    id, theme, title: clean(title), days, items: items.map(clean), assign: assign.map(clean), unlocked,
    gift: gift && { from: clean(gift.from), token: gift.token },
  };
}

export function serializePreset(preset) {
  return JSON.stringify(preset).replace(/[<>&\u2028\u2029]/g, (char) => HTML_SENSITIVE[char]);
}

export function parsePreset(text) {
  try {
    const data = JSON.parse(text);
    return isPreset(data) ? normalize(data) : null;
  } catch {
    return null;
  }
}

export function fileName(title, extension = '.html') {
  const safe = clean(title).replace(UNSAFE_IN_FILE_NAMES, ' ').replace(/\s+/g, ' ').trim();
  return `${[...safe].slice(0, 60).join('') || 'advent-calendar'}${extension}`;
}
