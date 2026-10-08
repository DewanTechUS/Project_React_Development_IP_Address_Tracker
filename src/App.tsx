import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import InfoCards from "./components/InfoCards";
import MapView from "./components/MapView";
import { useIpify } from "./hooks/useIpify";

export default function App() {
  const { data, loading, error, lookup } = useIpify();

  // Start with the visitor's own public IP.
  useEffect(() => {
    lookup("");
  }, [lookup]);

  return (
    <div className="page">
      <a className="skipLink" href="#main">Skip to content</a>
      <Header />

      <main id="main" className="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <h1 id="hero-title" className="heroTitle">Look up any IP address or domain</h1>
            <p className="heroSubtitle">See its location, timezone and internet provider.</p>

            <SearchBar onSearch={lookup} isLoading={loading} />

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
        </div>
      </main>

      <Footer />
    </div>
  );
}
