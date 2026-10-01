import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultTheme, themePresets, statusColors } from "./themeConfig.js";

const ThemeContext = createContext(null);

// bump version to invalidate old stored themes so users see the new palette
const STORAGE_KEY = "nova-admin-theme-v2";

function readInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultTheme, ...JSON.parse(raw) };
  } catch {}
  return defaultTheme;
}

function applyThemeVars(theme) {
  const root = document.documentElement;
  const preset = themePresets[theme.preset] || themePresets.neutral;

  root.style.setProperty("--color-primary", preset.primaryColor);
  root.style.setProperty("--color-primary-hover", preset.primaryHover);
  root.style.setProperty("--color-primary-soft", preset.primarySoft);
  root.style.setProperty("--color-secondary", preset.secondaryColor);
  root.style.setProperty("--color-accent", preset.accentColor);
  root.style.setProperty("--color-sidebar", preset.sidebarColor);
  root.style.setProperty("--color-sidebar-text", preset.sidebarText);
  root.style.setProperty("--color-sidebar-active", preset.sidebarActive);
  root.style.setProperty("--color-sidebar-active-text", preset.sidebarActiveText);

  root.style.setProperty("--color-success", statusColors.success);
  root.style.setProperty("--color-warning", statusColors.warning);
  root.style.setProperty("--color-danger", statusColors.danger);
  root.style.setProperty("--color-info", statusColors.info);

  root.style.setProperty("--radius", `${theme.radius}px`);
  root.setAttribute("data-theme", theme.mode);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitial);

  useEffect(() => {
    applyThemeVars(theme);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(theme)); } catch {}
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setPreset: (preset) => setTheme((t) => ({ ...t, preset })),
      setMode: (mode) => setTheme((t) => ({ ...t, mode })),
      toggleMode: () => setTheme((t) => ({ ...t, mode: t.mode === "dark" ? "light" : "dark" })),
      setRadius: (radius) => setTheme((t) => ({ ...t, radius })),
      reset: () => setTheme(defaultTheme),
      presets: themePresets,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
