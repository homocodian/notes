import * as Sentry from "@sentry/bun";

Sentry.init({
  dsn: "https://efc7013b1ac25cd69a614607b7c17f65@o4507646828609536.ingest.us.sentry.io/4507772148776960",
  // Tracing
  tracesSampleRate: 1.0 // Capture 100% of the transactions
});
