import { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import InfoCards from "./components/InfoCards";
import MapView from "./components/MapView";
import { fetchIpData } from "./lib/ipify";
import type { IpifyResponse } from "./lib/types";

export default function App() {
  const [data, setData] = useState<IpifyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function runSearch(value: string) {
    try {
      setError("");
      setLoading(true);
      const res = await fetchIpData(value);
      setData(res);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch("");
  }, []);

  return (
    <div className="page">
      <div className="top">
        <Header />
        <SearchBar onSearch={runSearch} isLoading={loading} />

        {error ? (
          <div className="error" role="alert">
            {error}
          </div>
        ) : null}
        <InfoCards data={data} />
      </div>

      <div className="mapOuter">
        <div className="mapInner">
          <MapView data={data} />
        </div>
      </div>
    </div>
  );
}
