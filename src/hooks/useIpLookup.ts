import { useCallback, useEffect, useRef, useState } from "react";
import { fetchIpData } from "../lib/api";
import type { IpLookupResult } from "../lib/types";

function toMessage(e: unknown) {
  // fetch() rejects with a TypeError when the request never reaches the server.
  if (e instanceof TypeError) {
    return "Unable to reach the server. Check your connection and try again.";
  }
  return e instanceof Error ? e.message : "Something went wrong while fetching data.";
}

export function useIpLookup() {
  const [data, setData] = useState<IpLookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const controllerRef = useRef<AbortController | null>(null);

  const lookup = useCallback(async (query: string) => {
    // Cancel any in-flight request so an older response can't overwrite a newer one.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setError("");
    setLoading(true);

    try {
      const res = await fetchIpData(query, controller.signal);
      setData(res);
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(toMessage(e));
    } finally {
      if (controllerRef.current === controller) setLoading(false);
    }
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { data, loading, error, lookup };
}
