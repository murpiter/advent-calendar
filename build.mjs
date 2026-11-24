import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import * as esbuild from 'esbuild';
import { LANGUAGES } from './src/i18n/index.js';
import { DEFAULT_THEME, THEMES } from './src/themes/index.js';

const OUT_DIR = 'dist';
const OFFLINE_SKIPS = ['sw.js', 'fonts/licenses/'];

async function bundle(entry, define = {}) {
  const result = await esbuild.build({
    entryPoints: [entry],
    define,
    bundle: true,
    minify: true,
    write: false,
    target: 'es2022',
    legalComments: 'none',
  });
  return result.outputFiles[0].text.trim();
}

function fontFaces(fonts) {
  return fonts.map(({ family, weight, unicodeRange, file }) => `@font-face{font-family:'${family}';font-style:normal;`
    + `font-weight:${weight};font-display:swap;src:url(fonts/${file}) format('woff2');unicode-range:${unicodeRange}}`).join('');
}

const digest = (data) => createHash('sha256').update(data).digest('base64');

function sha256(text) {
  return `'sha256-${digest(text)}'`;
}

function contentSecurityPolicy(js, css) {
  return [
    "default-src 'none'",
    `script-src ${sha256(js)}`,
    `style-src ${sha256(css)}`,
    "font-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join('; ');
}

const manifestName = (theme, lang) => `manifest-${theme}-${lang}.webmanifest`;

function manifest(theme, strings) {
  const icon = (size, purpose) => ({ src: `icons/${theme.id}-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose });
  return {
    id: './',
    name: strings.pageTitle,
    short_name: strings.pageTitle,
    lang: strings.lang,
    start_url: './',
    scope: './',
    display: 'standalone',
    background_color: theme.color,
    theme_color: theme.color,
    icons: [icon(192, 'any'), icon(512, 'any'), icon(512, 'maskable')],
  };
}

async function writeManifests() {
  for (const theme of Object.values(THEMES)) {
    for (const strings of Object.values(LANGUAGES)) {
      await writeFile(`${OUT_DIR}/${manifestName(theme.id, strings.lang)}`, JSON.stringify(manifest(theme, strings)));
    }
  }
}

async function offlineFiles() {
  const entries = await readdir(OUT_DIR, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => `${entry.parentPath}/${entry.name}`.slice(OUT_DIR.length + 1))
    .filter((path) => !OFFLINE_SKIPS.some((skip) => path.startsWith(skip)))
    .sort();
}

async function writeServiceWorker() {
  const files = await offlineFiles();
  const contents = await Promise.all(files.map((path) => readFile(`${OUT_DIR}/${path}`)));
  const version = digest(Buffer.concat(contents)).slice(0, 12);
  const cached = files.map((path) => (path === 'index.html' ? './' : path));
  const sw = await bundle('src/sw.js', { __VERSION__: JSON.stringify(version), __FILES__: JSON.stringify(cached) });
  await writeFile(`${OUT_DIR}/sw.js`, sw);
}

function assertInlineSafe(name, text) {
  if (/<\/(script|style)/i.test(text)) throw new Error(`${name} contains a closing tag`);
}

const [template, js, styles, fonts] = await Promise.all([
  readFile('src/index.html', 'utf8'),
  bundle('src/app.js'),
  bundle('src/styles/index.css'),
  readFile('src/fonts.json', 'utf8').then(JSON.parse),
]);
const css = fontFaces(fonts) + styles;
assertInlineSafe('script', js);
assertInlineSafe('style', css);

const html = template
  .replace('%CSP%', () => contentSecurityPolicy(js, css))
  .replace('%CSS%', () => css)
  .replace('%JS%', () => js)
  .replaceAll('%THEME%', DEFAULT_THEME)
  .replace('%COLOR%', THEMES[DEFAULT_THEME].color);

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR);
await cp('public', OUT_DIR, { recursive: true });
await writeFile(`${OUT_DIR}/index.html`, html);
await writeManifests();
await writeServiceWorker();
