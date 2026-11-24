import en from './en.js';
import ru from './ru.js';

export const LANGUAGES = { ru, en };

export function detectLanguage(saved, preferred) {
  if (Object.hasOwn(LANGUAGES, saved)) return saved;
  const match = preferred.map((tag) => tag.slice(0, 2).toLowerCase()).find((code) => Object.hasOwn(LANGUAGES, code));
  return match ?? 'en';
}

export const otherLanguage = (code) => (code === 'ru' ? 'en' : 'ru');
