import Logo from "./Logo";
import { BRAND, LINKS } from "../lib/brand";

const FOOTER_LINKS = [
  { label: "DewanTech.com", href: LINKS.website },
  { label: "Portfolio", href: LINKS.portfolio },
  { label: "GitHub", href: LINKS.github },
];

export default function Footer() {
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
        </nav>

        <p className="copyright">{BRAND.copyright}</p>
      </div>
    </footer>
  );
}
