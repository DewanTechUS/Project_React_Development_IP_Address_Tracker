import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import RecentSearches from "./components/RecentSearches";
import InfoCards from "./components/InfoCards";
import MapView from "./components/MapView";
import IpDetails from "./components/IpDetails";
import { useIpLookup } from "./hooks/useIpLookup";
import { addRecent, clearRecent, loadRecent } from "./lib/recent";
import { normalizeQuery } from "./utils/validators";

// A shared link like "?q=8.8.8.8" opens straight to that result.
const INITIAL_QUERY = normalizeQuery(new URLSearchParams(window.location.search).get("q") ?? "");

function shareLink(query: string) {
  const url = new URL(window.location.pathname, window.location.origin);
  if (query) url.searchParams.set("q", query);
  return url.toString();
}

export default function App() {
  const { data, loading, error, lookup } = useIpLookup();
  const [input, setInput] = useState(INITIAL_QUERY);
  const [recent, setRecent] = useState(loadRecent);

  const search = useCallback(
    async (value: string) => {
      const query = normalizeQuery(value);
      const result = await lookup(query);
      if (!result) return;

      window.history.replaceState(null, "", query ? `?q=${encodeURIComponent(query)}` : window.location.pathname);
      if (query) setRecent((items) => addRecent(items, query));
    },
    [lookup],
  );

  function searchFromChip(query: string) {
    setInput(query);
    search(query);
  }

  // Start with the shared query (already in the URL), or the visitor's own public IP.
  useEffect(() => {
    lookup(INITIAL_QUERY);
  }, [lookup]);

  return (
    <div className="page">
      <a className="skipLink" href="#main">Skip to content</a>
      <Header />

      <main id="main" className="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <h1 id="hero-title" className="heroTitle">Look up any IP address or domain</h1>
            <p className="heroSubtitle">See its location, network and internet provider.</p>

            <SearchBar value={input} onChange={setInput} onSearch={search} isLoading={loading} />
            <RecentSearches items={recent} onSelect={searchFromChip} onClear={() => setRecent(clearRecent())} />

            <div className="errorSlot" aria-live="assertive">
              {error ? (
                <p className="error" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <div className="container results">
          <InfoCards data={data} isLoading={loading} />

          <section className="mapCard" aria-label="Location map">
            <MapView data={data} />
          </section>

          {/* Share the IP itself so the link shows the same result to anyone who opens it. */}
          {data ? <IpDetails data={data} shareUrl={shareLink(data.ip)} /> : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
