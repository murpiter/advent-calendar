import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import * as esbuild from 'esbuild';

const OUT_DIR = 'dist';

async function bundle(entry) {
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    write: false,
    target: 'es2022',
    legalComments: 'none',
  });
  return result.outputFiles[0].text.trim();
}

function sha256(text) {
  return `'sha256-${createHash('sha256').update(text).digest('base64')}'`;
}

function contentSecurityPolicy(js, css) {
  return [
    "default-src 'none'",
    `script-src ${sha256(js)}`,
    `style-src ${sha256(css)} https://fonts.googleapis.com`,
    'font-src https://fonts.gstatic.com',
    "img-src 'self' data:",
    "base-uri 'none'",
    "form-action 'none'",
  ].join('; ');
}

function assertInlineSafe(name, text) {
  if (/<\/(script|style)/i.test(text)) throw new Error(`${name} contains a closing tag`);
}

const [template, js, css] = await Promise.all([
  readFile('src/index.html', 'utf8'),
  bundle('src/app.js'),
  bundle('src/styles/index.css'),
]);
assertInlineSafe('script', js);
assertInlineSafe('style', css);

const html = template
  .replace('%CSP%', () => contentSecurityPolicy(js, css))
  .replace('%CSS%', () => css)
  .replace('%JS%', () => js);

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR);
await writeFile(`${OUT_DIR}/index.html`, html);
