import { randomUUID } from "node:crypto";
import express from "express";
import { getDb } from "./db.js";
import { clientIP, lookup } from "./ipify.js";
import { rateLimit } from "./rateLimit.js";
import { parseUserAgent } from "./userAgent.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NAME_RE = /^[\p{L}\p{N} .'-]{1,50}$/u;

export function isVisitorId(value) {
  return typeof value === "string" && UUID_RE.test(value);
}

// Accept only known, bounded fields from the browser.
function cleanDevice(input = {}) {
  const str = (v, max = 64) => (typeof v === "string" ? v.slice(0, max) : null);
  const num = (v) => (Number.isFinite(v) && v >= 0 && v < 100_000 ? v : null);
  return {
    timezone: str(input.timezone),
    language: str(input.language, 35),
    languages: Array.isArray(input.languages) ? input.languages.slice(0, 5).map((l) => str(l, 35)) : [],
    screenWidth: num(input.screenWidth),
    screenHeight: num(input.screenHeight),
    viewportWidth: num(input.viewportWidth),
    viewportHeight: num(input.viewportHeight),
    pixelRatio: num(input.pixelRatio),
    touch: typeof input.touch === "boolean" ? input.touch : null,
    colorScheme: input.colorScheme === "dark" || input.colorScheme === "light" ? input.colorScheme : null,
  };
}

function requireDb(res) {
  const db = getDb();
  if (!db) res.status(503).json({ error: "Saving is unavailable right now. Please try again later." });
  return db;
}

/** Saves a search for visitors who opted in. Never blocks or fails the lookup. */
export function recordSearch(visitorId, query, result) {
  const db = getDb();
  if (!db || !isVisitorId(visitorId)) return;

  db.collection("visitors")
    .findOneAndUpdate({ visitorId }, { $set: { lastSeenAt: new Date() } })
    .then((visitor) => {
      if (!visitor) return;
      return db.collection("ip_search_history").insertOne({
        visitorId,
        query: query || "(own IP)",
        result: {
          ip: result.ip,
          city: result.location.city,
          region: result.location.region,
          country: result.location.country,
          isp: result.isp ?? null,
        },
        createdAt: new Date(),
      });
    })
    .catch((err) => console.error("Failed to record search:", err.message));
}

export function visitorRouter(apiKey) {
  const router = express.Router();
  router.use(rateLimit({ windowMs: 60_000, max: 10 }));
  router.use(express.json({ limit: "4kb" }));

  // Create or update a profile. Requires explicit consent from the modal.
  router.post("/", async (req, res) => {
    const { name, consent, device, visitorId: existingId } = req.body ?? {};
    const trimmed = typeof name === "string" ? name.trim() : "";

    if (consent !== true) {
      res.status(400).json({ error: "Consent is required to save your information." });
      return;
    }
    if (!NAME_RE.test(trimmed)) {
      res.status(400).json({ error: "Enter a name of 1–50 letters, numbers, spaces, periods, apostrophes or hyphens." });
      return;
    }

    const db = requireDb(res);
    if (!db) return;

    const visitorId = isVisitorId(existingId) ? existingId : randomUUID();
    const ip = clientIP(req) || null;
    const userAgent = (req.get("user-agent") ?? "").slice(0, 512);

    let location = null;
    try {
      const geo = await lookup("", ip, apiKey);
      location = { ...geo.location, isp: geo.isp ?? null, ip: geo.ip };
    } catch {
      // Location is best-effort; save the profile without it.
    }

    const now = new Date();
    try {
      await db.collection("visitors").updateOne(
        { visitorId },
        {
          $set: {
            name: trimmed,
            ip: ip ?? location?.ip ?? null,
            location,
            userAgent,
            ...parseUserAgent(userAgent),
            acceptLanguage: (req.get("accept-language") ?? "").slice(0, 128),
            device: cleanDevice(device),
            lastSeenAt: now,
          },
          $setOnInsert: { visitorId, createdAt: now, consentAt: now },
        },
        { upsert: true },
      );
      res.status(201).json({ visitorId, name: trimmed });
    } catch (err) {
      console.error("Failed to save visitor:", err.message);
      res.status(500).json({ error: "Could not save your information. Please try again." });
    }
  });

  // "Forget me": delete the profile and all of its search history.
  router.delete("/:visitorId", async (req, res) => {
    const { visitorId } = req.params;
    if (!isVisitorId(visitorId)) {
      res.status(400).json({ error: "Invalid visitor ID." });
      return;
    }

    const db = requireDb(res);
    if (!db) return;

    try {
      await Promise.all([
        db.collection("visitors").deleteOne({ visitorId }),
        db.collection("ip_search_history").deleteMany({ visitorId }),
      ]);
      res.status(204).end();
    } catch (err) {
      console.error("Failed to delete visitor:", err.message);
      res.status(500).json({ error: "Could not delete your information. Please try again." });
    }
  });

  return router;
}
