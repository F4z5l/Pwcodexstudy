import { useCallback, useEffect, useState } from "react";

export const THEMES = [
  { id: "light", label: "Light Mode", emoji: "☀️" },
  { id: "dark", label: "Dark Mode", emoji: "🌙" },
  { id: "sandalwood", label: "Sandalwood", emoji: "🌳" },
  { id: "forest-emerald", label: "Forest Emerald", emoji: "🍃" },
  { id: "ocean-deep", label: "Ocean Deep", emoji: "🌊" },
  { id: "sakura-blossom", label: "Sakura Blossom", emoji: "🌸" },
  { id: "dracula-midnight", label: "Dracula Midnight", emoji: "👻" },
  { id: "lavender-mist", label: "Lavender Mist", emoji: "🪄" },
  { id: "cyberpunk-neon", label: "Cyberpunk Neon", emoji: "⚡" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const STORAGE_KEY = "marco-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (stored && THEMES.some((t) => t.id === stored)) {
      setThemeState(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { theme, setTheme };
}
