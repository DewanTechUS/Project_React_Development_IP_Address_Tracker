import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { LookupError, clientIP, lookup } from "./ipify.js";
import { rateLimit } from "./rateLimit.js";

try {
  process.loadEnvFile();
} catch {
  // No .env file: rely on the environment (e.g. Render's settings).
}

const isDev = process.argv.includes("--dev");
const port = Number(process.env.PORT) || 3000;
const apiKey = process.env.IPIFY_API_KEY;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (!apiKey) {
  console.error("Missing IPIFY_API_KEY. Add it to .env or the host's environment settings.");
  process.exit(1);
}

const app = express();
app.disable("x-powered-by");
// Render runs behind proxies; read the visitor's IP from X-Forwarded-For.
app.set("trust proxy", true);

app.use((_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  next();
});

app.get("/api/lookup", rateLimit({ windowMs: 60_000, max: 30 }), async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 255) : "";

  try {
    const data = await lookup(query, clientIP(req), apiKey);
    res.set("Cache-Control", "no-store").json(data);
  } catch (err) {
    if (err instanceof LookupError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error("Lookup failed:", err);
    res.status(502).json({ error: "The geolocation service is unavailable right now. Please try again." });
  }
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found." });
});

const server = app.listen(port, () => {
  console.log(`IP Address Tracker running at http://localhost:${port}`);
});

if (isDev) {
  // Serve the React app through Vite, with hot reload sharing this server's port.
  const { createServer } = await import("vite");
  const vite = await createServer({
    root,
    appType: "spa",
    server: { middlewareMode: true, hmr: { server } },
    configLoader: "runner", // loads vite.config.ts in memory, so `node --watch` doesn't loop on a temp file
  });
  app.use(vite.middlewares);
} else {
  const dist = path.join(root, "dist");
  app.use("/assets", express.static(path.join(dist, "assets"), { immutable: true, maxAge: "1y" }));
  app.use(express.static(dist));
}
