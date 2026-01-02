import { useCallback, useRef, useState } from "react";
import { isDomain, isIPv4 } from "../utils/validators";

type IpifyResponse = {
  ip: string;
  isp: string;
  location: {
    city: string;
    region: string;
    country: string;
    timezone: string; 
    lat: number;
    lng: number;
  };
};

type LookupArgs =
  | { type: "auto" }
  | { type: "query"; value: string };

const BASE = "https://geo.ipify.org/api/v2/country,city";

export function useIpify() {
  const [data, setData] = useState<IpifyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const controllerRef = useRef<AbortController | null>(null);

  const lookup = useCallback(async (args: LookupArgs) => {
    const apiKey = import.meta.env.VITE_IPIFY_API_KEY as string | undefined;

    if (!apiKey) {
      setError("Missing API key. VITE_IPIFY_API_KEY is missing in .env file.");
      return;
    }

    setError("");
    setLoading(true);

  
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      let url = `${BASE}?apiKey=${encodeURIComponent(apiKey)}`;

      if (args.type === "query") {
        const value = args.value.trim();

        if (isIPv4(value)) {
          url += `&ipAddress=${encodeURIComponent(value)}`;
        } else if (isDomain(value)) {
          url += `&domain=${encodeURIComponent(value)}`;
        } else {
          setLoading(false);
          setError("Please enter a valid IPv4 address (e.g., 8.8.8.8) or a domain (e.g., google.com).");
          return;
        }
      }

      const res = await fetch(url, { signal: controllerRef.current.signal });
      if (!res.ok) {
        
        throw new Error(`Request failed (${res.status}). Check your key or rate limit.`);
      }

      const json = (await res.json()) as IpifyResponse;
      setData(json);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setError(e?.message || "Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, lookup };
}
