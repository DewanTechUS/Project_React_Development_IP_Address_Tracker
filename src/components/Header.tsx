import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="header">
      <div className="headerRow">
        <div>
          <h1>Dewan Mahmud Project React Development IP Address Tracker</h1>
          <p className="muted">Search any IP or domain to see location and map.</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}