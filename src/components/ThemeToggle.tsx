import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button className="themeBtn" onClick={toggle} type="button" aria-label="Toggle theme">
      {theme === "light" ? "dark" : "light"} 
    </button>
  );
}
