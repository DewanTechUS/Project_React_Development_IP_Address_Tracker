import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onSave: (name: string) => Promise<void>;
  onSkip: () => void;
};

const SAVED_ITEMS = [
  "Your name",
  "IP address, approximate location and internet provider",
  "Browser, operating system and device type",
  "Screen size, language and timezone",
  "The IP addresses and domains you search",
];

export default function WelcomeModal({ open, onSave, onSkip }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(name.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your information. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-intro"
      onCancel={(e) => {
        e.preventDefault();
        onSkip();
      }}
    >
      <form className="modalBody" onSubmit={handleSubmit}>
        <h2 id="welcome-title" className="modalTitle">Welcome to IP Address Tracker</h2>
        <p id="welcome-intro" className="modalText">
          Add your name to personalize your visit and keep a history of your searches. This is optional.
        </p>

        <label htmlFor="visitor-name" className="fieldLabel">Your name</label>
        <input
          id="visitor-name"
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          autoComplete="name"
          required
        />

        <div className="savedInfo">
          <p className="savedInfoTitle">If you agree, we save:</p>
          <ul>
            {SAVED_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="savedInfoNote">
            Kept for up to 12 months. Delete it anytime with <strong>Forget me</strong> at the bottom of the page.
          </p>
        </div>

        <label className="consent">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>I agree to DewanTech™ saving this information.</span>
        </label>

        {error ? (
          <p className="modalError" role="alert">
            {error}
          </p>
        ) : null}

        <div className="modalActions">
          <button type="button" className="btn btnSecondary" onClick={onSkip}>
            Skip
          </button>
          <button type="submit" className="btn btnPrimary" disabled={!agreed || !name.trim() || saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
