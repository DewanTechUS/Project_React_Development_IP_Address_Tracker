import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      className={`themeSwitch ${isDark ? "on" : "off"}`}
      aria-label="Toggle dark and light mode"
    >
      <span className="switchThumb" />
    </button>
  );
}
