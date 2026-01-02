import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./context/ThemeContext";
import { useIpify } from "./hooks/useIpify";

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
  const { data, loading, error, lookup } = useIpify();

  const [query, setQuery] = useState("");
  const [lastSearched, setLastSearched] = useState("");


  useEffect(() => {
    lookup({ type: "auto" });
 
  }, []);

  function onSubmitSearch(value: string) {
    setLastSearched(value);
    lookup({ type: "query", value });
    setQuery("");
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-top">
          <h1 className="title">Dewan Mahmud Project React Development IP Address Tracker</h1>
          <ThemeToggle />
        </div>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={onSubmitSearch}
          disabled={loading}
          placeholder="Search for any IP address or domain"
        />

        <div className="status">
          {error ? (
            <p className="error" role="alert">
              {error}
            </p>
          ) : loading ? (
            <p className="muted">Fetching results…</p>
          ) : lastSearched ? (
            <p className="muted">
              Showing results for: <strong>{lastSearched}</strong>
            </p>
          ) : (
            <p className="muted">Showing your current IP info.</p>
          )}
        </div>
      </header>

      <main className="mapWrap" aria-label="Map showing IP location">
        
      </main>
    </div>
  );
}
