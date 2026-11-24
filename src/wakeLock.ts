// Keep the screen on while someone is praying, so a phone does not lock during
// a long prayer or a pause to contemplate a mystery. After a few minutes without
// moving to another prayer, or once the rosary is complete, the device's normal
// auto-lock returns.
const IDLE_MS = 5 * 60 * 1000;
let wanted = false;
let lock: WakeLockSentinel | undefined;
let request: Promise<void> | undefined;
let idleTimer: ReturnType<typeof setTimeout> | undefined;

function acquire() {
  if (!wanted || lock || request || document.hidden || !('wakeLock' in navigator)) return;
  request = navigator.wakeLock.request('screen').then(sentinel => {
    if (!wanted) { void sentinel.release(); return; }
    lock = sentinel;
    // The browser releases the lock itself whenever the page is hidden.
    sentinel.addEventListener('release', () => { if (lock === sentinel) lock = undefined; });
  }, () => { /* Unsupported, denied, or battery saver: the screen locks as usual. */ })
    .finally(() => { request = undefined; });
}

export function keepAwake(active: boolean) {
  clearTimeout(idleTimer);
  wanted = active;
  if (!active) { void lock?.release(); lock = undefined; return; }
  acquire();
  idleTimer = setTimeout(() => keepAwake(false), IDLE_MS);
}

document.addEventListener('visibilitychange', () => { if (!document.hidden) acquire(); });
