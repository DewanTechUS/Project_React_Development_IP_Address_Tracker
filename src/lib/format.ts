import type { IpLocation } from "./types";

export function formatLocation({ city, region, country }: IpLocation) {
  return [city, region, country].filter(Boolean).join(", ");
}

/** "US" → "United States (US)". Falls back to the code if the browser can't name it. */
export function formatCountry(code: string) {
  if (!code) return "";
  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(code);
    return name && name !== code ? `${name} (${code})` : code;
  } catch {
    return code;
  }
}

/** Current time at a UTC offset such as "-04:00", e.g. "Tue 3:42 PM". */
export function formatLocalTime(offset: string, now: Date) {
  const match = /^([+-])(\d{2}):(\d{2})$/.exec(offset);
  if (!match) return "";
  const minutes = (Number(match[2]) * 60 + Number(match[3])) * (match[1] === "-" ? -1 : 1);
  const shifted = new Date(now.getTime() + minutes * 60_000);
  return shifted.toLocaleString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatCoordinates(lat: number, lng: number) {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export function ipVersion(ip: string) {
  return ip.includes(":") ? "IPv6" : "IPv4";
}

/** Only http(s) URLs from the API are rendered as links. */
export function safeUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}
