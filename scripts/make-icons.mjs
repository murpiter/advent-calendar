import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const SOURCE_DIR = 'art/icons';
const OUT_DIR = process.argv[2] ?? 'public/icons';
const SIZES = [180, 192, 512];

function render(svg, size) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

async function makeIcons(name) {
  const svg = await readFile(join(SOURCE_DIR, name), 'utf8');
  const id = name.replace(/\.svg$/, '');
  for (const size of SIZES) {
    try {
      await writeFile(join(OUT_DIR, `${id}-${size}.png`), render(svg, size));
    } catch (error) {
      throw new Error(`Could not render ${name} at ${size}px: ${error.message}`);
    }
  }
}

await mkdir(OUT_DIR, { recursive: true });
const names = (await readdir(SOURCE_DIR)).filter((name) => name.endsWith('.svg'));
await Promise.all(names.map(makeIcons));
console.log(`${names.length * SIZES.length} icons in ${OUT_DIR}`);
