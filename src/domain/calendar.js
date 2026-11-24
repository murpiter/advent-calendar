export const DAYS = 25;

export function shuffle(items, random = Math.random) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function currentDay(date, days = DAYS) {
  return date.getMonth() === 11 ? Math.min(date.getDate(), days) : 0;
}

export const isLocked = (day, today) => day > today;

export const isOpen = (day, today, opened) => day < today || opened.includes(day);
