// Coarse browser / OS / device detection from the User-Agent header.
// Order matters: Edge and Opera include "Chrome", Chrome includes "Safari".
const BROWSERS = [
  ["Edge", /Edg\/([\d.]+)/],
  ["Opera", /OPR\/([\d.]+)/],
  ["Samsung Internet", /SamsungBrowser\/([\d.]+)/],
  ["Chrome", /(?:Chrome|CriOS)\/([\d.]+)/],
  ["Firefox", /(?:Firefox|FxiOS)\/([\d.]+)/],
  ["Safari", /Version\/([\d.]+).*Safari/],
];

const SYSTEMS = [
  ["iOS", /iPhone|iPad|iPod/],
  ["Android", /Android/],
  ["Windows", /Windows/],
  ["macOS", /Mac OS X|Macintosh/],
  ["ChromeOS", /CrOS/],
  ["Linux", /Linux/],
];

function match(table, ua) {
  for (const [name, re] of table) {
    const m = ua.match(re);
    if (m) return { name, version: m[1]?.split(".")[0] ?? null };
  }
  return { name: "Other", version: null };
}

export function parseUserAgent(ua = "") {
  const browser = match(BROWSERS, ua);
  const os = match(SYSTEMS, ua).name;
  const deviceType = /iPad|Tablet/.test(ua) ? "tablet" : /Mobi|iPhone|Android/.test(ua) ? "mobile" : "desktop";
  return { browser: browser.name, browserVersion: browser.version, os, deviceType };
}
