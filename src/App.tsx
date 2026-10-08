import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import InfoCards from "./components/InfoCards";
import MapView from "./components/MapView";
import WelcomeModal from "./components/WelcomeModal";
import { useIpLookup } from "./hooks/useIpLookup";
import { dismissPrompt, forgetVisitor, loadVisitor, saveVisitor, wasPromptDismissed } from "./lib/visitor";

export default function App() {
  const { data, loading, error, lookup } = useIpLookup();
  const [visitor, setVisitor] = useState(loadVisitor);
  const [promptOpen, setPromptOpen] = useState(() => !loadVisitor() && !wasPromptDismissed());

  async function handleSave(name: string) {
    setVisitor(await saveVisitor(name));
    setPromptOpen(false);
  }

  function handleSkip() {
    dismissPrompt();
    setPromptOpen(false);
  }

  async function handleForget() {
    if (!visitor || !window.confirm("Delete your saved name, device information and search history?")) return;
    try {
      await forgetVisitor(visitor.visitorId);
      setVisitor(null);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Could not delete your information.");
    }
  }

  // Start with the visitor's own public IP.
  useEffect(() => {
    lookup("");
  }, [lookup]);

  return (
    <div className="page">
      <a className="skipLink" href="#main">Skip to content</a>
      <Header visitorName={visitor?.name} />

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

      <Footer
        hasProfile={visitor !== null}
        onForget={handleForget}
        onAddName={() => setPromptOpen(true)}
      />

      <WelcomeModal open={promptOpen} onSave={handleSave} onSkip={handleSkip} />
    </div>
  );
}
