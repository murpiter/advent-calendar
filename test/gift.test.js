import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { decodeGift, encodeGift } from '../src/domain/gift.js';

const gift = {
  theme: 'palace',
  title: 'Для Маши ✨',
  days: 24,
  items: Array.from({ length: 24 }, (_, i) => `Сюрприз №${i + 1}: «какао» & <печенье>`),
  from: 'Алиса',
  note: 'С наступающим!\nОткрывай по одной.',
  unlocked: true,
};

async function tokenOf(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  const packed = new Uint8Array(await new Response(stream).arrayBuffer());
  return `1${Buffer.from(packed).toString('base64url')}`;
}

describe('gift link', async () => {
  test('survives the round trip unchanged', async () => {
    assert.deepEqual(await decodeGift(await encodeGift(gift)), gift);
  });

  test('links made before the unlock setting open with doors locked', async () => {
    const { unlocked, ...older } = gift;
    assert.equal((await decodeGift(await tokenOf(older))).unlocked, false);
  });

  test('fits into a link that messengers accept', async () => {
    const token = await encodeGift({ ...gift, days: 31, items: Array.from({ length: 31 }, (_, i) => `Дело номер ${i + 1} на этот день`) });
    assert.ok(token.length < 2000, `token is ${token.length} chars`);
  });

  const broken = {
    'random text': 'hello world',
    'an unknown version': `9${(await encodeGift(gift)).slice(1)}`,
    'a day count outside 24, 25 or 31': await tokenOf({ ...gift, days: 26 }),
    'items that do not match the day count': await tokenOf({ ...gift, items: gift.items.slice(1) }),
    'an item that is not text': await tokenOf({ ...gift, items: [42, ...gift.items.slice(1)] }),
    'an empty item': await tokenOf({ ...gift, items: ['', ...gift.items.slice(1)] }),
    'an item made only of invisible characters': await tokenOf({ ...gift, items: ['\u200B\u202E', ...gift.items.slice(1)] }),
    'a very long note': await tokenOf({ ...gift, note: 'a'.repeat(5000) }),
    'an unlock flag that is not true or false': await tokenOf({ ...gift, unlocked: 'yes' }),
    'a theme name with markup': await tokenOf({ ...gift, theme: '"><script>' }),
    'a link longer than any real gift': `1${'A'.repeat(20000)}`,
    'a small link that unpacks into megabytes': await tokenOf({ ...gift, note: ' '.repeat(5_000_000) }),
  };
  for (const [name, token] of Object.entries(broken)) {
    test(`rejects ${name}`, async () => assert.equal(await decodeGift(token), null));
  }

  test('drops invisible control characters', async () => {
    const decoded = await decodeGift(await tokenOf({ ...gift, from: 'Ал\u202Eиса\u0007' }));
    assert.equal(decoded.from, 'Алиса');
  });
});
