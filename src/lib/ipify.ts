import type { IpifyResponse } from "./types";

const BASE_URL = "https://geo.ipify.org/api/v2/country,city";

export async function fetchIpData(query: string): Promise<IpifyResponse> {
  const apiKey = import.meta.env.VITE_IPIFY_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error("Missing VITE_IPIFY_API_KEY in .env");
  }

  const trimmed = query.trim();
  const isDomain = /[a-zA-Z]/.test(trimmed);
  const url = new URL(BASE_URL);
  url.searchParams.set("apiKey", apiKey);

  if (trimmed) {
    if (isDomain) url.searchParams.set("domain", trimmed);
    else url.searchParams.set("ipAddress", trimmed);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Request failed. Check the IP/domain and try again.");
  }

  const data = (await res.json()) as IpifyResponse;

  if (!data?.location?.lat || !data?.location?.lng) {
    throw new Error("No location found for that query.");
  }

  return data;
}
