import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button onClick={toggle} className="themeBtn">
      {theme === "dark" ? " Light" : " Dark"}
    </button>
  );
}
