import { useTheme } from "../context/theme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggle}
      className={`themeSwitch ${isDark ? "on" : "off"}`}
      aria-label="Dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="switchThumb" aria-hidden="true">
        {isDark ? "☾" : "☀"}
      </span>
    </button>
  );
}
