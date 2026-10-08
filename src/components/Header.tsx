import ThemeToggle from "./ThemeToggle";
import { LINKS } from "../lib/brand";
import appIconUrl from "../assets/ip-tracker-icon.jpg";

export default function Header() {
  return (
    <header className="siteHeader">
      <div className="container headerBar">
        <a className="appBrand" href="/">
          <img className="appIcon" src={appIconUrl} alt="" width={36} height={36} />
          <span className="appName">IP Address Tracker</span>
        </a>

        <nav className="headerNav" aria-label="Primary">
          <a className="navLink" href={LINKS.repo} target="_blank" rel="noopener noreferrer">
            Source
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
