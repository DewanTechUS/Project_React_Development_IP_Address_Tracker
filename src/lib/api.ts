import type { IpLookupResult } from "./types";
import { isDomain, isIP, normalizeQuery } from "../utils/validators";
import { loadVisitor } from "./visitor";

const FALLBACK_ERROR = "The geolocation service is unavailable right now. Please try again.";

export async function fetchIpData(query: string, signal?: AbortSignal): Promise<IpLookupResult> {
  const value = normalizeQuery(query);

  // Validate here for instant feedback; the server validates again.
  if (value && !isIP(value) && !isDomain(value)) {
    throw new Error("Enter a valid IP address (e.g. 8.8.8.8) or domain (e.g. example.com).");
  }

  // Only visitors who opted in send their ID, so their searches can be saved.
  const visitorId = loadVisitor()?.visitorId;
  const res = await fetch(`/api/lookup?q=${encodeURIComponent(value)}`, {
    signal,
    headers: visitorId ? { "X-Visitor-Id": visitorId } : undefined,
  });
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.error ?? FALLBACK_ERROR);
  }
  return body as IpLookupResult;
}
