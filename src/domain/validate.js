import { DAY_OPTIONS } from './calendar.js';

export const LIMITS = { title: 60, item: 200, from: 60, note: 400 };

const INVISIBLE = /[\u0000-\u0009\u000B-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g;
const THEME_PATTERN = /^[a-z]{1,20}$/;

export const clean = (text) => text.replace(INVISIBLE, '');
export const isText = (value, max) => typeof value === 'string' && value.length <= max;
export const isLine = (value, max) => isText(value, max) && !value.includes('\n');
export const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export const isTaskList = (items, days) => Array.isArray(items) && items.length === days
  && items.every((item) => isLine(item, LIMITS.item) && item.trim() !== '');

export const isCalendar = (data) => THEME_PATTERN.test(data.theme)
  && isLine(data.title, LIMITS.title)
  && DAY_OPTIONS.includes(data.days)
  && isTaskList(data.items, data.days);
