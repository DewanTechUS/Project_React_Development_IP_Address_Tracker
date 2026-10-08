export function isIPv4(value: string) {
  const parts = value.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d{1,3}$/.test(p)) return false;
    const num = Number(p);
    return num >= 0 && num <= 255;
  });
}

// Lets the browser's URL parser do strict IPv6 validation.
export function isIPv6(value: string) {
  if (!value.includes(":")) return false;
  try {
    new URL(`http://[${value}]`);
    return true;
  } catch {
    return false;
  }
}

export function isIP(value: string) {
  return isIPv4(value) || isIPv6(value);
}

export function isDomain(value: string) {
  const regex = /^(?=.{1,253}$)(?!-)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;
  return regex.test(value);
}

// Accepts pasted URLs like "https://example.com/path" and keeps only the host.
export function normalizeQuery(value: string) {
  return value
    .trim()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, "")
    .split(/[/?#]/)[0];
}
