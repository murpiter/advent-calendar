import { serializePreset } from '../domain/preset.js';
import fonts from '../fonts.json';

const PRESET_ID = 'preset';
const FONTS_ID = 'embedded-fonts';
const WEB_APP_LINKS = ['manifest', 'touchIcon', 'favicon'];

export function takePreset() {
  const node = document.getElementById(PRESET_ID);
  node?.remove();
  return node?.textContent ?? null;
}

export const capturePage = () => `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;

export function newCalendarId() {
  return Array.from(crypto.getRandomValues(new Uint8Array(8)), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function toBase64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function embeddedFace({ family, weight, unicodeRange, file }) {
  const response = await fetch(`fonts/${file}`);
  if (!response.ok) throw new Error(file);
  const data = toBase64(new Uint8Array(await response.arrayBuffer()));
  return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;`
    + `src:url(data:font/woff2;base64,${data}) format('woff2');unicode-range:${unicodeRange}}`;
}

async function fontCss(families, page) {
  try {
    const faces = await Promise.all(fonts.filter((face) => families.includes(face.family)).map(embeddedFace));
    return faces.join('');
  } catch {
    return page.getElementById(FONTS_ID)?.textContent ?? '';
  }
}

async function sha256(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return `'sha256-${toBase64(new Uint8Array(digest))}'`;
}

async function allowFonts(page, css) {
  const meta = page.querySelector('meta[http-equiv="Content-Security-Policy"]');
  const hash = await sha256(css);
  meta.content = meta.content
    .replace(/style-src ('[^']+')[^;]*/, (_, own) => `style-src ${own} ${hash}`)
    .replace(/font-src [^;]*/, "font-src 'self' data:");
}

function upsert(page, { id, tag, text, insert }) {
  page.getElementById(id)?.remove();
  const node = page.createElement(tag);
  node.id = id;
  node.textContent = text;
  insert(node);
  return node;
}

export async function buildSavedPage({ pageHtml, preset, families }) {
  const page = new DOMParser().parseFromString(pageHtml, 'text/html');
  for (const id of WEB_APP_LINKS) page.getElementById(id)?.remove();
  const css = await fontCss(families, page);
  upsert(page, { id: FONTS_ID, tag: 'style', text: css, insert: (node) => page.head.querySelector('style').after(node) });
  await allowFonts(page, css);
  const data = serializePreset(preset);
  upsert(page, { id: PRESET_ID, tag: 'script', text: data, insert: (node) => page.body.querySelector('script').before(node) })
    .type = 'application/json';
  return `<!DOCTYPE html>\n${page.documentElement.outerHTML}`;
}
