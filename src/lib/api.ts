import type { IpLookupResult } from "./types";
import { isDomain, isIP, normalizeQuery } from "../utils/validators";

const FALLBACK_ERROR = "The geolocation service is unavailable right now. Please try again.";

export async function fetchIpData(query: string, signal?: AbortSignal): Promise<IpLookupResult> {
  const value = normalizeQuery(query);

  // Validate here for instant feedback; the server validates again.
  if (value && !isIP(value) && !isDomain(value)) {
    throw new Error("Enter a valid IP address (e.g. 8.8.8.8) or domain (e.g. example.com).");
  }

  const res = await fetch(`/api/lookup?q=${encodeURIComponent(value)}`, { signal });
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.error ?? FALLBACK_ERROR);
  }
  return body as IpLookupResult;
}
