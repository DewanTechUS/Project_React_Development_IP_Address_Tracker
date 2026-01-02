import { useState } from "react";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
  const [query, setQuery] = useState("");

  function onSubmitSearch(value: string) {
    // i will trigger the search functionality here later // for now just clear the input
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
          disabled={false}
          placeholder="Search for any IP address or domain"
        />
      </header>

      <main className="mapWrap" aria-label="Map showing IP location">
        
      </main>
    </div>
  );
}
