import forest from './forest.js';
import kawaii from './kawaii.js';
import mezen from './mezen.js';
import palace from './palace.js';

export const THEMES = { kawaii, palace, forest, mezen };
export const DEFAULT_THEME = 'kawaii';

export const themeById = (id) => THEMES[id] ?? THEMES[DEFAULT_THEME];
