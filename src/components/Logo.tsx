import logoUrl from "../assets/dewantech-logo.png";

export default function Logo() {
  return (
    <span className="brand">
      {/* Decorative: the wordmark beside it carries the name. */}
      <img className="brandMark" src={logoUrl} alt="" width={48} height={28} />
      <span className="brandName">
        Dewan<span className="brandAccent">Tech</span>
        <sup className="tm">™</sup>
      </span>
    </span>
  );
}
