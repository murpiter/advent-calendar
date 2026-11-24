import { DAYS, currentDay, isLocked, isOpen, shuffle } from './domain/calendar.js';
import strings from './i18n/ru.js';
import { loadState, persist } from './state.js';
import { themeById } from './themes/index.js';
import { $ } from './ui/dom.js';
import { openDoor } from './ui/door.js';
import { renderGrid, shake } from './ui/grid.js';
import { renderHero } from './ui/hero.js';
import { fillForm, parseItems, renderCount, renderThemes, validateItems } from './ui/setup.js';
import { createSnow } from './ui/snow.js';
import { toast } from './ui/toast.js';

const state = loadState(strings);
const snow = createSnow($('snow'));

const today = () => (state.demo ? state.demoDay : currentDay(new Date()));
const theme = () => themeById(state.theme);

function applyTheme() {
  document.body.className = `t-${state.theme}`;
  renderHero(theme(), state.title || strings.themes[state.theme].title, strings.subtitle(DAYS));
  snow.setTheme(theme());
}

function renderCalendar() {
  const day = today();
  renderGrid({ days: DAYS, today: day, opened: state.opened, theme: theme(), strings });
  $('dayLabel').textContent = state.demo ? strings.demoToday(day) : strings.today(day);
  $('modeBtn').textContent = state.demo ? strings.realDate : strings.demoMode;
  $('dayMinus').hidden = $('dayPlus').hidden = !state.demo;
}

function renderSetup() {
  renderThemes(state.theme, strings);
  fillForm(state);
  renderCount(DAYS, strings);
}

function renderStaticText() {
  const labels = {
    toSetup: strings.setup, reshuffle: strings.reshuffle, styleHeading: strings.styleHeading,
    itemsHeading: strings.itemsHeading(DAYS), titleLabel: strings.titleLabel, itemsLabel: strings.itemsLabel,
    build: strings.build, example: strings.example, back: strings.back,
  };
  for (const [id, text] of Object.entries(labels)) $(id).textContent = text;
  $('dayMinus').setAttribute('aria-label', strings.prevDay);
  $('dayPlus').setAttribute('aria-label', strings.nextDay);
}

function show(view) {
  $('viewCal').hidden = view !== 'cal';
  $('viewSetup').hidden = view !== 'setup';
  window.scrollTo(0, 0);
}

function onDoorClick(event) {
  const cell = event.target.closest('.cell');
  if (!cell) return;
  const day = Number(cell.dataset.day);
  if (isLocked(day, today())) {
    shake(cell);
    toast(strings.lockedToast(day));
    return;
  }
  const fresh = !isOpen(day, today(), state.opened);
  if (fresh) {
    state.opened.push(day);
    persist(state);
    renderCalendar();
  }
  const returnFocus = $('grid').querySelector(`[data-day="${day}"]`);
  openDoor({ day, text: state.assign[day - 1], theme: theme(), strings, fresh, returnFocus });
}

function shiftDemoDay(delta) {
  state.demoDay = Math.min(DAYS, Math.max(0, state.demoDay + delta));
  renderCalendar();
}

function onThemePick(event) {
  const card = event.target.closest('.tcard');
  if (!card) return;
  state.theme = card.dataset.theme;
  persist(state);
  applyTheme();
  renderCalendar();
  renderThemes(state.theme, strings);
}

function onBuild() {
  const items = parseItems($('itemsIn').value);
  const error = validateItems(items, DAYS, strings);
  $('err').textContent = error;
  if (error) return;
  Object.assign(state, {
    items,
    title: $('titleIn').value.trim() || strings.themes[state.theme].title,
    assign: shuffle(items),
    opened: [],
  });
  persist(state);
  applyTheme();
  renderCalendar();
  show('cal');
  toast(strings.built);
}

function onReshuffle() {
  Object.assign(state, { assign: shuffle(state.items), opened: [] });
  persist(state);
  renderCalendar();
  toast(strings.reshuffled);
}

function onExample() {
  fillForm({ title: strings.exampleTitle, items: strings.exampleItems });
  renderCount(DAYS, strings);
  $('err').textContent = '';
}

function bindEvents() {
  $('grid').addEventListener('click', onDoorClick);
  $('dayMinus').addEventListener('click', () => shiftDemoDay(-1));
  $('dayPlus').addEventListener('click', () => shiftDemoDay(1));
  $('modeBtn').addEventListener('click', () => {
    state.demo = !state.demo;
    renderCalendar();
  });
  $('toSetup').addEventListener('click', () => {
    renderSetup();
    show('setup');
  });
  $('reshuffle').addEventListener('click', onReshuffle);
  $('themes').addEventListener('click', onThemePick);
  $('itemsIn').addEventListener('input', () => {
    renderCount(DAYS, strings);
    $('err').textContent = '';
  });
  $('example').addEventListener('click', onExample);
  $('back').addEventListener('click', () => show('cal'));
  $('build').addEventListener('click', onBuild);
}

renderStaticText();
applyTheme();
renderCalendar();
bindEvents();
persist(state);
