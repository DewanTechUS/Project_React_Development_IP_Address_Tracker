import ThemeToggle from "./ThemeToggle";
import { LINKS } from "../lib/brand";
import appIconUrl from "../assets/ip-tracker-icon.jpg";

type Props = {
  visitorName?: string;
};

export default function Header({ visitorName }: Props) {
  return (
    <header className="siteHeader">
      <div className="container headerBar">
        <a className="appBrand" href="/">
          <img className="appIcon" src={appIconUrl} alt="" width={36} height={36} />
          <span className="appName">IP Address Tracker</span>
        </a>

        <nav className="headerNav" aria-label="Primary">
          {visitorName ? <span className="greeting">Hi, {visitorName}</span> : null}
          <a className="navLink" href={LINKS.repo} target="_blank" rel="noopener noreferrer">
            Source
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
