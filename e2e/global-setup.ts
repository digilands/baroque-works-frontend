/**
 * Wake the Render.com backend before the suite runs. Cold starts can take
 * 30-60s; without this the first backend-backed test absorbs the spin-up
 * and flakes on timeouts.
 */
async function globalSetup() {
  const base =
    process.env.NEXT_PUBLIC_API_URL ??
    "https://baroque-works-backend.onrender.com/api/v1";
  const deadline = Date.now() + 180_000;
  for (;;) {
    try {
      const res = await fetch(`${base}/categories?limit=1`);
      // Any HTTP response (even 401) proves the service is awake.
      if (res.status > 0) break;
    } catch {
      // connection refused / timeout while spinning up — retry
    }
    if (Date.now() > deadline) break;
    await new Promise((r) => setTimeout(r, 5_000));
  }
}

export default globalSetup;
