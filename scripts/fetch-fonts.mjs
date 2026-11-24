import { mkdir, writeFile } from 'node:fs/promises';

const FAMILIES = {
  Fredoka: { weights: [400, 500, 600], repo: 'fredoka' },
  Nunito: { weights: [400, 600, 700], repo: 'nunito' },
  'Cormorant Garamond': { weights: [500, 600, 700], repo: 'cormorantgaramond' },
  'Playfair Display': { weights: [500, 700], repo: 'playfairdisplay' },
  Oswald: { weights: [400, 500, 600], repo: 'oswald' },
  Barlow: { weights: [400, 500, 600], repo: 'barlow' },
};
const SUBSETS = ['cyrillic', 'latin'];
const BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const OUT = 'public/fonts';

const slug = (family) => family.toLowerCase().replaceAll(' ', '-');

async function fetchOk(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}

function parseFaces(css) {
  const pattern = /\/\* ([\w-]+) \*\/\s*@font-face \{[^}]*?font-family: '([^']+)';[^}]*?font-weight: (\d+);[^}]*?src: url\((\S+?)\)[^}]*?unicode-range: ([^;]+);/g;
  return [...css.matchAll(pattern)]
    .map(([, subset, family, weight, url, unicodeRange]) => ({ subset, family, weight: Number(weight), url, unicodeRange }))
    .filter((face) => SUBSETS.includes(face.subset));
}

function mergeWeights(faces) {
  const byFile = new Map();
  for (const face of faces) {
    const known = byFile.get(face.url);
    if (known) known.weights.push(face.weight);
    else byFile.set(face.url, { ...face, weights: [face.weight] });
  }
  return [...byFile.values()].map(({ weights, weight, ...face }) => ({
    ...face,
    weight: Math.min(...weights) === Math.max(...weights) ? `${weights[0]}` : `${Math.min(...weights)} ${Math.max(...weights)}`,
    file: `${slug(face.family)}-${face.subset}${weights.length === 1 ? `-${weights[0]}` : ''}.woff2`,
  }));
}

async function download(face) {
  const bytes = new Uint8Array(await (await fetchOk(face.url)).arrayBuffer());
  await writeFile(`${OUT}/${face.file}`, bytes);
}

async function downloadLicense([family, { repo }]) {
  const text = await (await fetchOk(`https://raw.githubusercontent.com/google/fonts/main/ofl/${repo}/OFL.txt`)).text();
  await writeFile(`${OUT}/licenses/${slug(family)}.txt`, text);
}

const query = Object.entries(FAMILIES)
  .map(([family, { weights }]) => `family=${family.replaceAll(' ', '+')}:wght@${weights.join(';')}`)
  .join('&');
const css = await (await fetchOk(`https://fonts.googleapis.com/css2?${query}&display=swap`, { headers: { 'User-Agent': BROWSER } })).text();
const faces = mergeWeights(parseFaces(css));

await mkdir(`${OUT}/licenses`, { recursive: true });
await Promise.all([...faces.map(download), ...Object.entries(FAMILIES).map(downloadLicense)]);
const manifest = faces.map(({ family, weight, unicodeRange, file }) => ({ family, weight, unicodeRange, file }));
await writeFile('src/fonts.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${faces.length} font files`);
