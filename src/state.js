import { DAY_OPTIONS, DEFAULT_DAYS, shuffle } from './domain/calendar.js';
import { load, save } from './storage/store.js';
import { DEFAULT_THEME, THEMES } from './themes/index.js';

const STORED = ['lang', 'theme', 'title', 'days', 'items', 'assign', 'opened', 'unlocked'];

const isTextList = (value, length) => Array.isArray(value)
  && value.length === length
  && value.every((item) => typeof item === 'string');

const isDayList = (value, days) => Array.isArray(value)
  && value.every((day) => Number.isInteger(day) && day >= 1 && day <= days);

const pick = (value, isValid, fallback) => (isValid(value) ? value : fallback);

export function exampleItems(strings, days) {
  return [...strings.exampleItems.slice(0, days - 1), strings.exampleFinale];
}

export function translateExample(state, from, to) {
  const source = [...from.exampleItems, from.exampleFinale];
  const target = [...to.exampleItems, to.exampleFinale];
  const translate = (text) => target[source.indexOf(text)];
  if (!state.items.every((text) => source.includes(text))) return;
  state.items = state.items.map(translate);
  state.assign = state.assign.map(translate);
  if (state.title === from.exampleTitle) state.title = to.exampleTitle;
}

function loadCalendar(strings) {
  const days = pick(load('days'), (v) => DAY_OPTIONS.includes(v), DEFAULT_DAYS);
  const items = pick(load('items'), (v) => isTextList(v, days), exampleItems(strings, days));
  return {
    days,
    items,
    assign: pick(load('assign'), (v) => isTextList(v, days), shuffle(items)),
    opened: pick(load('opened'), (v) => isDayList(v, days), []),
  };
}

export function loadState(lang, strings) {
  return {
    lang,
    theme: pick(load('theme'), (v) => Object.hasOwn(THEMES, v), DEFAULT_THEME),
    title: pick(load('title'), (v) => typeof v === 'string', strings.exampleTitle),
    unlocked: load('unlocked') === true,
    ...loadCalendar(strings),
    demo: false,
    demoDay: 1,
  };
}

export function persist(state) {
  for (const key of STORED) save(key, state[key]);
}
