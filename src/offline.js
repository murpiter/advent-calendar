const SKIP_WAITING = 'skip-waiting';

function offerWhenInstalled(worker, offer) {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') offer(worker);
  });
}

function watchUpdates(registration, onUpdate) {
  const offer = (worker) => onUpdate(() => worker.postMessage(SKIP_WAITING));
  if (registration.waiting) offer(registration.waiting);
  registration.addEventListener('updatefound', () => {
    if (registration.installing) offerWhenInstalled(registration.installing, offer);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') registration.update().catch(() => {});
  });
}

function reloadOnTakeover() {
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });
}

export function enableOffline(onUpdate) {
  if (!('serviceWorker' in navigator)) return;
  const updating = Boolean(navigator.serviceWorker.controller);
  if (updating) reloadOnTakeover();
  navigator.serviceWorker.register('sw.js')
    .then((registration) => updating && watchUpdates(registration, onUpdate))
    .catch(() => {});
}
