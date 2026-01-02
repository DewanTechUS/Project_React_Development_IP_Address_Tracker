import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
  return (
    <div className="app">
      <header className="hero">
        <h1 className="title">Dewan Mahmud Project React Development IP Address Tracker</h1>
      </header>

      <main className="mapWrap" aria-label="Map showing IP location">
        
      </main>
    </div>
  );
}
