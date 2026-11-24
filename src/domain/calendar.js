export const DAY_OPTIONS = [24, 25, 31];
export const DEFAULT_DAYS = 25;

const DECEMBER = 11;
const JANUARY = 0;

export function shuffle(items, random = Math.random) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function currentDay(date, days) {
  if (date.getMonth() === DECEMBER) return Math.min(date.getDate(), days);
  return date.getMonth() === JANUARY ? days : 0;
}

export function doorState(day, { today, opened, unlocked }) {
  if (day < today || opened.includes(day)) return 'open';
  return day > today && !unlocked ? 'locked' : 'ready';
}
