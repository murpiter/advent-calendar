import { DAY_OPTIONS } from './calendar.js';

const VERSION = '1';
const MAX_TOKEN_LENGTH = 8000;
const MAX_UNPACKED_BYTES = 64 * 1024;
const LIMITS = { title: 60, item: 200, from: 60, note: 400 };
const TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;
const THEME_PATTERN = /^[a-z]{1,20}$/;
const INVISIBLE = /[\u0000-\u0009\u000B-\u001F\u007F​-‏‪-‮⁦-⁩]/g;

const clean = (text) => text.replace(INVISIBLE, '');
const isText = (value, max) => typeof value === 'string' && value.length <= max;
const isLine = (value, max) => isText(value, max) && !value.includes('\n');

function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromBase64Url(text) {
  const binary = atob(text.replaceAll('-', '+').replaceAll('_', '/'));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function pack(text) {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function unpack(bytes) {
  const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
  const chunks = [];
  let size = 0;
  for (let next = await reader.read(); !next.done; next = await reader.read()) {
    size += next.value.length;
    if (size > MAX_UNPACKED_BYTES) {
      await reader.cancel();
      throw new RangeError('gift is too large');
    }
    chunks.push(next.value);
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(await new Blob(chunks).arrayBuffer());
}

function isValidGift(gift) {
  return gift !== null && typeof gift === 'object'
    && THEME_PATTERN.test(gift.theme)
    && isLine(gift.title, LIMITS.title)
    && DAY_OPTIONS.includes(gift.days)
    && Array.isArray(gift.items) && gift.items.length === gift.days
    && gift.items.every((item) => isLine(item, LIMITS.item) && item.trim() !== '')
    && isLine(gift.from, LIMITS.from)
    && isText(gift.note, LIMITS.note);
}

function normalize({ theme, title, days, items, from, note }) {
  return { theme, title: clean(title), days, items: items.map(clean), from: clean(from), note: clean(note) };
}

export async function encodeGift(gift) {
  return VERSION + toBase64Url(await pack(JSON.stringify(normalize(gift))));
}

export async function decodeGift(token) {
  if (typeof token !== 'string' || token.length > MAX_TOKEN_LENGTH) return null;
  if (!token.startsWith(VERSION) || !TOKEN_PATTERN.test(token.slice(1))) return null;
  try {
    const gift = JSON.parse(await unpack(fromBase64Url(token.slice(1))));
    return isValidGift(gift) ? normalize(gift) : null;
  } catch {
    return null;
  }
}
