import { DAYS, shuffle } from './domain/calendar.js';
import { load, save } from './storage/store.js';
import { DEFAULT_THEME, THEMES } from './themes/index.js';

const isTextList = (value, length) => Array.isArray(value)
  && value.length === length
  && value.every((item) => typeof item === 'string');

const isDayList = (value) => Array.isArray(value)
  && value.every((day) => Number.isInteger(day) && day >= 1 && day <= DAYS);

function pick(value, isValid, fallback) {
  return isValid(value) ? value : fallback;
}

export function loadState(strings) {
  const items = pick(load('items'), (v) => isTextList(v, DAYS), strings.exampleItems);
  return {
    theme: pick(load('theme'), (v) => Object.hasOwn(THEMES, v), DEFAULT_THEME),
    title: pick(load('title'), (v) => typeof v === 'string', strings.exampleTitle),
    items,
    assign: pick(load('assign'), (v) => isTextList(v, DAYS), shuffle(items)),
    opened: pick(load('opened'), isDayList, []),
    demo: true,
    demoDay: 7,
  };
}

export function persist(state) {
  for (const key of ['theme', 'title', 'items', 'assign', 'opened']) save(key, state[key]);
}
