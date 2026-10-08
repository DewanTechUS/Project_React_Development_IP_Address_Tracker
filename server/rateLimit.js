// Fixed-window, in-memory rate limiter. Protects the IPify API credits
// on a single-instance deployment without an extra dependency.
export function rateLimit({ windowMs, max }) {
  const hits = new Map();

  setInterval(() => hits.clear(), windowMs).unref();

  return (req, res, next) => {
    const key = req.ip ?? "unknown";
    const count = (hits.get(key) ?? 0) + 1;
    hits.set(key, count);

    if (count > max) {
      res.status(429).json({ error: "Too many requests. Please wait a minute and try again." });
      return;
    }
    next();
  };
}
