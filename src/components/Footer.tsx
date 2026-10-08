import Logo from "./Logo";
import { COPYRIGHT, LINKS } from "../lib/brand";

const FOOTER_LINKS = [
  { label: "DewanTech.com", href: LINKS.website },
  { label: "Portfolio", href: LINKS.portfolio },
  { label: "GitHub", href: LINKS.github },
];

type Props = {
  hasProfile: boolean;
  onForget: () => void;
  onAddName: () => void;
};

export default function Footer({ hasProfile, onForget, onAddName }: Props) {
  return (
    <footer className="siteFooter">
      <div className="container footerInner">
        <Logo />

        <nav className="footerLinks" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
          {hasProfile ? (
            <button type="button" className="linkButton" onClick={onForget}>
              Forget me
            </button>
          ) : (
            <button type="button" className="linkButton" onClick={onAddName}>
              Add your name
            </button>
          )}
        </nav>

        <p className="copyright">{COPYRIGHT}</p>
      </div>
    </footer>
  );
}
