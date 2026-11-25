import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const FAMILIES = [
  { family: 'Cormorant Garamond', id: 'cormorant-garamond', subsets: ['cyrillic', 'latin'] },
  { family: 'Fredoka', id: 'fredoka', subsets: ['latin'] },
  { family: 'Lobster', id: 'lobster', subsets: ['cyrillic', 'latin'], weight: 400 },
  { family: 'Nunito', id: 'nunito', subsets: ['cyrillic', 'latin'] },
  { family: 'Oswald', id: 'oswald', subsets: ['cyrillic', 'latin'] },
  { family: 'Playfair Display', id: 'playfair-display', subsets: ['cyrillic', 'latin'] },
  { family: 'Ruslan Display', id: 'ruslan-display', subsets: ['cyrillic', 'latin'], weight: 400 },
];

const require = createRequire(import.meta.url);

const packageName = ({ id, weight }) => (weight ? `@fontsource/${id}` : `@fontsource-variable/${id}`);
const packageDir = (font) => dirname(require.resolve(`${packageName(font)}/package.json`));
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));

async function facesOf(font) {
  const dir = packageDir(font);
  const [metadata, ranges] = await Promise.all([readJson(join(dir, 'metadata.json')), readJson(join(dir, 'unicode.json'))]);
  const { min, max } = metadata.variable?.wght ?? {};
  const weight = font.weight ? `${font.weight}` : `${min} ${max}`;
  const style = font.weight ? `${font.weight}-normal` : 'wght-normal';
  return font.subsets.map((subset) => {
    if (!ranges[subset]) throw new Error(`${font.family} has no ${subset} subset`);
    const file = `${font.id}-${subset}-${style}.woff2`;
    return { family: font.family, weight, unicodeRange: ranges[subset], file, source: join(dir, 'files', file) };
  });
}

export async function copyFonts(outDir) {
  await mkdir(join(outDir, 'licenses'), { recursive: true });
  const faces = (await Promise.all(FAMILIES.map(facesOf))).flat();
  await Promise.all([
    ...faces.map(({ source, file }) => copyFile(source, join(outDir, file))),
    ...FAMILIES.map((font) => copyFile(join(packageDir(font), 'LICENSE'), join(outDir, 'licenses', `${font.id}.txt`))),
  ]);
  return faces.map(({ source, ...face }) => face);
}
