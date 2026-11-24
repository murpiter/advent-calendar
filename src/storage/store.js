let PREFIX = 'adv_';

export function useNamespace(id) {
  PREFIX = `adv_${id}_`;
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    return false;
  }
  return true;
}
