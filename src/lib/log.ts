// Anonymous usage logging. Privacy-critical: this sends NOTHING about the user's
// birth input. The serverless endpoint records only a timestamp + the country it
// derives from the request IP header. If no endpoint is configured, it no-ops.

const ENDPOINT = import.meta.env.VITE_LOG_ENDPOINT ?? '/api/log';

let logged = false;

/** Fire a single anonymous "result viewed" hit. Safe to call more than once. */
export function logResultView(): void {
  if (logged) return;
  logged = true;
  try {
    // keepalive lets the beacon complete even if the tab is closing.
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'result_view' }),
      keepalive: true,
    }).catch(() => {
      /* logging is best-effort; never disrupt the user */
    });
  } catch {
    /* ignore */
  }
}
