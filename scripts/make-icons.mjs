import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SOURCE_DIR = 'art/icons';
const OUT_DIR = 'public/icons';
const SIZES = [180, 192, 512];

const run = promisify(execFile);

function page(svg, size) {
  const sized = svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
  return `<!DOCTYPE html><html><body style="margin:0">${sized}</body></html>`;
}

async function render(svg, size, out, workDir) {
  const file = join(workDir, `${size}.html`);
  await writeFile(file, page(svg, size));
  await run(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=${size},${size}`,
    `--screenshot=${resolve(out)}`, `file://${file}`]);
}

const workDir = await mkdtemp(join(tmpdir(), 'icons-'));
await mkdir(OUT_DIR, { recursive: true });
for (const name of await readdir(SOURCE_DIR)) {
  const svg = await readFile(join(SOURCE_DIR, name), 'utf8');
  const id = name.replace(/\.svg$/, '');
  for (const size of SIZES) await render(svg, size, join(OUT_DIR, `${id}-${size}.png`), workDir);
}
await rm(workDir, { recursive: true });
