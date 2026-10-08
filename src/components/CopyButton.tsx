import { useEffect, useState } from "react";

type Props = {
  text: string;
  label: string;
  buttonText?: string;
};

export default function CopyButton({ text, label, buttonText = "Copy" }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); fail quietly.
    }
  }

  return (
    <button type="button" className="copyBtn" onClick={handleCopy} aria-label={label} title={label}>
      {copied ? "Copied" : buttonText}
      <span className="srOnly" aria-live="polite">{copied ? `${label}: copied` : ""}</span>
    </button>
  );
}
