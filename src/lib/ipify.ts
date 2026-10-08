import type { IpifyResponse } from "./types";
import { isDomain, isIP, normalizeQuery } from "../utils/validators";

const BASE_URL = "https://geo.ipify.org/api/v2/country,city";

function statusMessage(status: number) {
  if (status === 400 || status === 422) {
    return "No results for that IP address or domain. Check the spelling and try again.";
  }
  if (status === 401 || status === 403) {
    return "The geolocation service rejected the request. The API key may be invalid or out of credits.";
  }
  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }
  return `The geolocation service is unavailable right now (error ${status}). Please try again.`;
}

export async function fetchIpData(query: string, signal?: AbortSignal): Promise<IpifyResponse> {
  const apiKey = import.meta.env.VITE_IPIFY_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error("The geolocation service is not configured. Add VITE_IPIFY_API_KEY to your .env file.");
  }

  const value = normalizeQuery(query);
  const url = new URL(BASE_URL);
  url.searchParams.set("apiKey", apiKey);

  // An empty query looks up the visitor's own public IP.
  if (value) {
    if (isIP(value)) url.searchParams.set("ipAddress", value);
    else if (isDomain(value)) url.searchParams.set("domain", value.toLowerCase());
    else {
      throw new Error("Enter a valid IP address (e.g. 8.8.8.8) or domain (e.g. example.com).");
    }
  }

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(statusMessage(res.status));
  }

  const data = (await res.json()) as IpifyResponse;

  if (!Number.isFinite(data?.location?.lat) || !Number.isFinite(data?.location?.lng)) {
    throw new Error("No location was found for that IP address or domain.");
  }

  return data;
}
