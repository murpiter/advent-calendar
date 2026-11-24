import { appUrl } from './config.js';
import { currentDay, doorState, shuffle } from './domain/calendar.js';
import { decodeGift, encodeGift } from './domain/gift.js';
import { parsePreset } from './domain/preset.js';
import { buildSavedPage, capturePage, download, newCalendarId, takePreset } from './export/save-file.js';
import { LANGUAGES, detectLanguage, otherLanguage } from './i18n/index.js';
import { exampleCalendar, exampleItems, isExample, loadState, persist, presetOf, translateExample } from './state.js';
import { load, useNamespace } from './storage/store.js';
import { themeById } from './themes/index.js';
import { $ } from './ui/dom.js';
import { openDoor } from './ui/door.js';
import { renderEnvelope } from './ui/envelope.js';
import { openGiftDialog } from './ui/gift-dialog.js';
import { renderGrid, shake } from './ui/grid.js';
import { renderHero } from './ui/hero.js';
import { fillForm, parseItems, renderCount, renderSetupForm, renderThemes, selectedDays, validateItems } from './ui/setup.js';
import { createSnow } from './ui/snow.js';
import { toast } from './ui/toast.js';

const presetText = takePreset();
const pageHtml = capturePage();
const preset = presetText && parsePreset(presetText);
if (preset) useNamespace(preset.id);

const lang = detectLanguage(load('lang', null), navigator.languages ?? [navigator.language]);
let strings = LANGUAGES[lang];
const state = loadState(lang, strings, preset);
const snow = createSnow($('snow'));

const today = () => (state.demo ? state.demoDay : currentDay(new Date(), state.days));
const theme = () => themeById(state.theme);
const doors = () => ({ today: today(), opened: state.opened, unlocked: state.unlocked });

function heroLines() {
  const lines = [strings.subtitle(state.days)];
  if (state.gift?.from) lines.push(strings.giftByline(state.gift.from));
  return lines;
}

function paintTheme(look, title, lines) {
  document.body.className = `t-${look.id}`;
  renderHero(look, title, lines);
  snow.setTheme(look);
}

function applyTheme() {
  paintTheme(theme(), state.title || strings.themes[state.theme].title, heroLines());
}

function renderCalendar() {
  renderGrid({ days: state.days, doors: doors(), today: today(), theme: theme(), strings });
  $('dayLabel').textContent = state.demo ? strings.demoToday(today()) : strings.today(today());
  for (const id of ['dayMinus', 'dayPlus', 'exitDemo']) $(id).hidden = !state.demo;
  $('toSetup').hidden = $('reshuffle').hidden = Boolean(state.gift);
  $('ownCalendar').hidden = !state.gift;
}

function renderAll() {
  applyTheme();
  renderCalendar();
}

function renderStaticText() {
  const labels = {
    toSetup: strings.setup, reshuffle: strings.reshuffle, saveBtn: strings.saveFile, exitDemo: strings.exitDemo, ownCalendar: strings.ownCalendar,
    styleHeading: strings.styleHeading, itemsHeading: strings.itemsHeading, titleLabel: strings.titleLabel,
    daysLabel: strings.daysLabel, itemsLabel: strings.itemsLabel, build: strings.build, giftBtn: strings.gift,
    example: strings.example, back: strings.back, doorsHeading: strings.doorsHeading,
    unlockLabel: strings.unlockLabel, demoLabel: strings.demoLabel,
  };
  for (const [id, text] of Object.entries(labels)) $(id).textContent = text;
  $('dayMinus').setAttribute('aria-label', strings.prevDay);
  $('dayPlus').setAttribute('aria-label', strings.nextDay);
  $('langBtn').textContent = strings.switchTo.code;
  $('langBtn').setAttribute('aria-label', strings.switchTo.label);
  document.documentElement.lang = strings.lang;
  document.title = strings.pageTitle;
}

function show(view) {
  for (const [id, name] of [['viewCal', 'cal'], ['viewSetup', 'setup'], ['viewGift', 'gift']]) $(id).hidden = view !== name;
  window.scrollTo(0, 0);
}

function switchLanguage() {
  const next = LANGUAGES[otherLanguage(state.lang)];
  translateExample(state, strings, next);
  strings = next;
  state.lang = next.lang;
  persist(state);
  renderStaticText();
  renderAll();
  renderThemes(state.theme, strings);
  renderCount(strings);
}

function onDoorClick(event) {
  const cell = event.target.closest('.cell');
  if (!cell) return;
  const day = Number(cell.dataset.day);
  const door = doorState(day, doors());
  if (door === 'locked') {
    shake(cell);
    toast(strings.lockedToast(day));
    return;
  }
  if (door === 'ready') {
    state.opened.push(day);
    persist(state);
    renderCalendar();
  }
  const returnFocus = $('grid').querySelector(`[data-day="${day}"]`);
  openDoor({ day, text: state.assign[day - 1], theme: theme(), strings, fresh: door === 'ready', returnFocus });
}

function setDemo(on) {
  state.demo = on;
  renderCalendar();
}

function shiftDemoDay(delta) {
  state.demoDay = Math.min(state.days, Math.max(0, state.demoDay + delta));
  renderCalendar();
}

function onThemePick(event) {
  const card = event.target.closest('.tcard');
  if (!card) return;
  state.theme = card.dataset.theme;
  persist(state);
  renderAll();
  renderThemes(state.theme, strings);
}

function readForm() {
  const days = selectedDays();
  const items = parseItems($('itemsIn').value);
  const error = validateItems(items, days, strings);
  $('err').textContent = error;
  const title = $('titleIn').value.trim() || strings.themes[state.theme].title;
  return error ? null : { days, items, title };
}

function onBuild() {
  const form = readForm();
  if (!form) return;
  Object.assign(state, form, { assign: shuffle(form.items), opened: [] });
  persist(state);
  renderAll();
  show('cal');
  toast(strings.built);
}

function onGive() {
  const form = readForm();
  if (!form) return;
  const makeLink = async ({ from, note }) => {
    const token = await encodeGift({ theme: state.theme, ...form, from, note });
    return `${appUrl()}#gift=${token}`;
  };
  openGiftDialog({ strings, makeLink, returnFocus: $('giftBtn') });
}

async function onSave() {
  const html = await buildSavedPage({ pageHtml, preset: presetOf(state, newCalendarId()), families: theme().fonts });
  download(html, state.title || strings.themes[state.theme].title);
  toast(strings.saved);
}

function onReshuffle() {
  Object.assign(state, { assign: shuffle(state.items), opened: [] });
  persist(state);
  renderCalendar();
  toast(strings.reshuffled);
}

function onFormChange() {
  renderCount(strings);
  $('err').textContent = '';
}

function onExample() {
  fillForm({ title: strings.exampleTitle, items: exampleItems(strings, selectedDays()) });
  onFormChange();
}

function onUnlockChange() {
  state.unlocked = $('unlockIn').checked;
  persist(state);
  renderCalendar();
}

function onOwnCalendar() {
  if (!window.confirm(strings.confirmOwn)) return;
  Object.assign(state, exampleCalendar(strings));
  persist(state);
  renderAll();
  renderSetupForm(state, strings);
}

const clearGiftFromAddress = () => history.replaceState(null, '', location.pathname + location.search);

function acceptGift(gift, token) {
  Object.assign(state, {
    theme: themeById(gift.theme).id,
    title: gift.title,
    days: gift.days,
    items: gift.items,
    assign: gift.items,
    opened: [],
    unlocked: false,
    gift: { from: gift.from, token },
  });
  persist(state);
  clearGiftFromAddress();
  renderAll();
  show('cal');
}

async function receiveGift() {
  const token = new URLSearchParams(location.hash.slice(1)).get('gift');
  if (!token) return;
  if (token === state.gift?.token) return clearGiftFromAddress();
  const gift = await decodeGift(token);
  if (!gift) {
    clearGiftFromAddress();
    return toast(strings.badGift);
  }
  const look = themeById(gift.theme);
  const replacing = Boolean(state.gift) || !isExample(state, strings);
  paintTheme(look, gift.title || strings.themes[look.id].title, [strings.subtitle(gift.days)]);
  const { open, later } = renderEnvelope({ gift, theme: look, strings, replacing });
  open.addEventListener('click', () => acceptGift(gift, token));
  later.addEventListener('click', () => {
    clearGiftFromAddress();
    applyTheme();
    show('cal');
  });
  show('gift');
}

function bindEvents() {
  $('grid').addEventListener('click', onDoorClick);
  $('dayMinus').addEventListener('click', () => shiftDemoDay(-1));
  $('dayPlus').addEventListener('click', () => shiftDemoDay(1));
  $('exitDemo').addEventListener('click', () => setDemo(false));
  $('toSetup').addEventListener('click', () => {
    renderSetupForm(state, strings);
    show('setup');
  });
  $('reshuffle').addEventListener('click', onReshuffle);
  $('saveBtn').addEventListener('click', onSave);
  $('ownCalendar').addEventListener('click', onOwnCalendar);
  $('langBtn').addEventListener('click', switchLanguage);
  $('themes').addEventListener('click', onThemePick);
  $('itemsIn').addEventListener('input', onFormChange);
  $('daysIn').addEventListener('change', onFormChange);
  $('example').addEventListener('click', onExample);
  $('unlockIn').addEventListener('change', onUnlockChange);
  $('demoIn').addEventListener('change', () => setDemo($('demoIn').checked));
  $('back').addEventListener('click', () => show('cal'));
  $('build').addEventListener('click', onBuild);
  $('giftBtn').addEventListener('click', onGive);
  window.addEventListener('hashchange', receiveGift);
}

renderStaticText();
renderAll();
renderSetupForm(state, strings);
bindEvents();
persist(state);
receiveGift();
