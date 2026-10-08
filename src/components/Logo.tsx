import markUrl from "../assets/dewantech-mark.png";

// DewanTech™ lockup: logo tile, wordmark and tagline.
export default function Logo() {
  return (
    <span className="brand">
      {/* Decorative: the wordmark beside it carries the name. */}
      <img className="brandMark" src={markUrl} alt="" width={52} height={52} />
      <span className="brandText">
        <span className="brandName">
          Dewan<span className="brandAccent">Tech</span>
          <span className="tm">™</span>
        </span>
        <span className="brandTagline">Technology Built with Purpose.</span>
      </span>
    </span>
  );
}
