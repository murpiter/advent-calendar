export const PUBLIC_URL = 'https://murpiter.github.io/advent-calendar/';

export const appUrl = () => (/^https?:$/.test(location.protocol) ? location.origin + location.pathname : PUBLIC_URL);
