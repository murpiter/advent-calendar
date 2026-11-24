import { currentDay, doorState, shuffle } from './domain/calendar.js';
import strings from './i18n/ru.js';
import { exampleItems, loadState, persist } from './state.js';
import { themeById } from './themes/index.js';
import { $ } from './ui/dom.js';
import { openDoor } from './ui/door.js';
import { renderGrid, shake } from './ui/grid.js';
import { renderHero } from './ui/hero.js';
import { fillForm, parseItems, renderCount, renderSetupForm, renderThemes, selectedDays, validateItems } from './ui/setup.js';
import { createSnow } from './ui/snow.js';
import { toast } from './ui/toast.js';

const state = loadState(strings);
const snow = createSnow($('snow'));

const today = () => (state.demo ? state.demoDay : currentDay(new Date(), state.days));
const theme = () => themeById(state.theme);
const doors = () => ({ today: today(), opened: state.opened, unlocked: state.unlocked });

function applyTheme() {
  document.body.className = `t-${state.theme}`;
  renderHero(theme(), state.title || strings.themes[state.theme].title, strings.subtitle(state.days));
  snow.setTheme(theme());
}

function renderCalendar() {
  renderGrid({ days: state.days, doors: doors(), today: today(), theme: theme(), strings });
  $('dayLabel').textContent = state.demo ? strings.demoToday(today()) : strings.today(today());
  for (const id of ['dayMinus', 'dayPlus', 'exitDemo']) $(id).hidden = !state.demo;
}

function renderStaticText() {
  const labels = {
    toSetup: strings.setup, reshuffle: strings.reshuffle, exitDemo: strings.exitDemo, styleHeading: strings.styleHeading,
    itemsHeading: strings.itemsHeading, titleLabel: strings.titleLabel, daysLabel: strings.daysLabel, itemsLabel: strings.itemsLabel,
    build: strings.build, example: strings.example, back: strings.back,
    doorsHeading: strings.doorsHeading, unlockLabel: strings.unlockLabel, demoLabel: strings.demoLabel,
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
  applyTheme();
  renderCalendar();
  renderThemes(state.theme, strings);
}

function onBuild() {
  const days = selectedDays();
  const items = parseItems($('itemsIn').value);
  const error = validateItems(items, days, strings);
  $('err').textContent = error;
  if (error) return;
  Object.assign(state, {
    days,
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
  $('themes').addEventListener('click', onThemePick);
  $('itemsIn').addEventListener('input', onFormChange);
  $('daysIn').addEventListener('change', onFormChange);
  $('example').addEventListener('click', onExample);
  $('unlockIn').addEventListener('change', onUnlockChange);
  $('demoIn').addEventListener('change', () => setDemo($('demoIn').checked));
  $('back').addEventListener('click', () => show('cal'));
  $('build').addEventListener('click', onBuild);
}

renderStaticText();
applyTheme();
renderCalendar();
bindEvents();
persist(state);
