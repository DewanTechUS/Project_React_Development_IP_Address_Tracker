import net from "node:net";

const BASE_URL = "https://geo.ipify.org/api/v2/country,city";
const DOMAIN_RE = /^(?=.{1,253}$)(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,63}$/i;
const TIMEOUT_MS = 8000;

export class LookupError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Loopback, private and link-local addresses can't be geolocated.
function isPrivateIP(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return a === 10 || a === 127 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254);
  }
  const lower = ip.toLowerCase();
  return lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80");
}

// Express reports IPv4 clients as "::ffff:1.2.3.4" on dual-stack sockets.
export function clientIP(req) {
  const ip = (req.ip ?? "").replace(/^::ffff:/, "");
  return net.isIP(ip) && !isPrivateIP(ip) ? ip : "";
}

function upstreamError(status) {
  if (status === 400 || status === 422) {
    return new LookupError(404, "No results for that IP address or domain. Check the spelling and try again.");
  }
  if (status === 401 || status === 403) {
    return new LookupError(502, "The geolocation service rejected the request. Please try again later.");
  }
  if (status === 429) {
    return new LookupError(429, "Too many requests. Please wait a moment and try again.");
  }
  return new LookupError(502, "The geolocation service is unavailable right now. Please try again.");
}

/**
 * Looks up an IP address or domain. An empty query falls back to the
 * visitor's own IP, or to ipify's view of the caller when running locally.
 */
export async function lookup(query, visitorIP, apiKey) {
  const url = new URL(BASE_URL);
  url.searchParams.set("apiKey", apiKey);

  if (query) {
    if (net.isIP(query)) url.searchParams.set("ipAddress", query);
    else if (DOMAIN_RE.test(query)) url.searchParams.set("domain", query.toLowerCase());
    else throw new LookupError(400, "Enter a valid IP address (e.g. 8.8.8.8) or domain (e.g. example.com).");
  } else if (visitorIP) {
    url.searchParams.set("ipAddress", visitorIP);
  }

  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw upstreamError(res.status);

  const data = await res.json();
  const { location } = data;
  if (!Number.isFinite(location?.lat) || !Number.isFinite(location?.lng)) {
    throw new LookupError(404, "No location was found for that IP address or domain.");
  }

  // Return only the fields the client uses.
  return {
    ip: data.ip,
    isp: data.isp,
    location: {
      city: location.city,
      region: location.region,
      country: location.country,
      timezone: location.timezone,
      lat: location.lat,
      lng: location.lng,
    },
  };
}
