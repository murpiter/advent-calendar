import { el, trustedSvg } from './dom.js';
import { button, showModal } from './modal.js';
import { qrSvg } from './qr.js';
import { toast } from './toast.js';

const LIMITS = { from: 60, note: 400 };

function field(label, control) {
  const wrap = el('label', 'field');
  wrap.append(el('span', '', label), control);
  return wrap;
}

function textInput(max, multiline = false) {
  const input = el(multiline ? 'textarea' : 'input', multiline ? 'note' : '');
  if (!multiline) input.type = 'text';
  input.maxLength = max;
  return input;
}

function qrBlock(link, strings) {
  try {
    const block = el('figure', 'qr');
    block.append(trustedSvg('qr-code', qrSvg(link)), el('figcaption', '', strings.qrHint));
    return block;
  } catch {
    return el('p', 'hint', strings.qrTooLong);
  }
}

async function copyLink(input, strings) {
  try {
    await navigator.clipboard.writeText(input.value);
    toast(strings.copied);
  } catch {
    input.select();
  }
}

function linkActions(input, strings) {
  const actions = el('div', 'actions');
  const copy = button(strings.copy, 'btn primary');
  copy.addEventListener('click', () => copyLink(input, strings));
  actions.append(copy);
  if (navigator.share) {
    const share = button(strings.share);
    share.addEventListener('click', () => navigator.share({ url: input.value }).catch(() => {}));
    actions.append(share);
  }
  return actions;
}

function renderResult(link, strings) {
  const input = textInput(link.length);
  input.value = link;
  input.readOnly = true;
  const result = el('div', 'gift-result');
  result.append(field(strings.giftLinkLabel, input), linkActions(input, strings), qrBlock(link, strings));
  return result;
}

export function openGiftDialog({ strings, makeLink, returnFocus }) {
  const from = textInput(LIMITS.from);
  const note = textInput(LIMITS.note, true);
  const create = button(strings.makeLink, 'btn primary');
  const close = button(strings.close);
  const result = el('div');
  const form = el('div', 'gift-form');
  form.append(el('h2', '', strings.giftHeading), el('p', 'hint', strings.giftOrder),
    field(strings.giftFromLabel, from), field(strings.giftNoteLabel, note), result);
  const actions = el('div', 'actions');
  actions.append(create, close);
  form.append(actions);

  const card = el('div', 'gift-card');
  card.append(form);
  const hide = showModal(card, { focus: from, returnFocus });
  close.addEventListener('click', hide);
  create.addEventListener('click', async () => {
    const link = await makeLink({ from: from.value.trim(), note: note.value.trim() });
    result.replaceChildren(renderResult(link, strings));
  });
}
