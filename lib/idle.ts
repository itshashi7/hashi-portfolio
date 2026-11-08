/** Run `fn` once the page has loaded and the main thread is idle (fallback: 1.2s). Returns a cancel function. */
export function whenIdle(fn: () => void, timeout = 2500): () => void {
  let cancelled = false;
  let idleId: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const run = () => {
    if (cancelled) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => !cancelled && fn(), { timeout });
    else timer = setTimeout(() => !cancelled && fn(), 1200);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
    const w = window as Window & { cancelIdleCallback?: (id: number) => void };
    if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
    if (timer) clearTimeout(timer);
  };
}
