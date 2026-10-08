export type Visitor = { visitorId: string; name: string };

const VISITOR_KEY = "visitor";
const DISMISSED_KEY = "visitorPromptDismissed";

// Storage can throw (private mode, blocked site data); treat that as "nothing saved".
function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Ignore: the app still works without persistence.
  }
}

export function loadVisitor(): Visitor | null {
  try {
    const parsed = JSON.parse(read(VISITOR_KEY) ?? "null");
    return typeof parsed?.visitorId === "string" && typeof parsed?.name === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function wasPromptDismissed() {
  return read(DISMISSED_KEY) === "1";
}

export function dismissPrompt() {
  write(DISMISSED_KEY, "1");
}

/** The device details listed in the consent modal, and nothing more. */
function collectDeviceInfo() {
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    languages: [...navigator.languages],
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    touch: navigator.maxTouchPoints > 0,
    colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  };
}

async function errorMessage(res: Response, fallback: string) {
  const body = await res.json().catch(() => null);
  return body?.error ?? fallback;
}

export async function saveVisitor(name: string): Promise<Visitor> {
  const res = await fetch("/api/visitors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      consent: true,
      visitorId: loadVisitor()?.visitorId,
      device: collectDeviceInfo(),
    }),
  });
  if (!res.ok) throw new Error(await errorMessage(res, "Could not save your information. Please try again."));

  const visitor = (await res.json()) as Visitor;
  write(VISITOR_KEY, JSON.stringify(visitor));
  return visitor;
}

export async function forgetVisitor(visitorId: string) {
  const res = await fetch(`/api/visitors/${encodeURIComponent(visitorId)}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await errorMessage(res, "Could not delete your information. Please try again."));

  write(VISITOR_KEY, null);
  dismissPrompt();
}
