import forest from './forest.js';
import gingerbread from './gingerbread.js';
import kawaii from './kawaii.js';
import mezen from './mezen.js';
import palace from './palace.js';

export const THEMES = { kawaii, palace, forest, mezen, gingerbread };
export const DEFAULT_THEME = 'kawaii';

export const themeById = (id) => (Object.hasOwn(THEMES, id) ? THEMES[id] : THEMES[DEFAULT_THEME]);
