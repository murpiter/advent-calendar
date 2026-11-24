export function setAppLook(theme, lang) {
  document.getElementById('themeColor')?.setAttribute('content', theme.color);
  document.getElementById('manifest')?.setAttribute('href', `manifest-${theme.id}-${lang}.webmanifest`);
  document.getElementById('touchIcon')?.setAttribute('href', `icons/${theme.id}-180.png`);
  document.getElementById('favicon')?.setAttribute('href', `icons/${theme.id}-192.png`);
}
