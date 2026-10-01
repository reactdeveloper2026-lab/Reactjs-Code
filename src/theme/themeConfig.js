/**
 * ==========================================================
 *  CENTRAL THEME CONFIGURATION
 * ==========================================================
 *  Change values here to change the entire Admin Panel look.
 *  These values are pushed into CSS variables at runtime by
 *  ThemeProvider (src/theme/ThemeProvider.jsx).
 * ==========================================================
 */

export const themePresets = {
  neutral: {
    name: "Neutral",
    primaryColor: "#2563eb",
    primaryHover: "#1d4ed8",
    primarySoft: "#eff6ff",
    secondaryColor: "#111827",
    accentColor: "#0ea5e9",
    sidebarColor: "#ffffff",
    sidebarText: "#4b5563",
    sidebarActive: "#eff6ff",
    sidebarActiveText: "#2563eb",
  },
  slate: {
    name: "Slate",
    primaryColor: "#475569",
    primaryHover: "#334155",
    primarySoft: "#f1f5f9",
    secondaryColor: "#0f172a",
    accentColor: "#64748b",
    sidebarColor: "#ffffff",
    sidebarText: "#475569",
    sidebarActive: "#f1f5f9",
    sidebarActiveText: "#0f172a",
  },
  emerald: {
    name: "Emerald",
    primaryColor: "#10b981",
    primaryHover: "#059669",
    primarySoft: "#ecfdf5",
    secondaryColor: "#111827",
    accentColor: "#14b8a6",
    sidebarColor: "#ffffff",
    sidebarText: "#4b5563",
    sidebarActive: "#ecfdf5",
    sidebarActiveText: "#059669",
  },
  indigo: {
    name: "Indigo",
    primaryColor: "#6366f1",
    primaryHover: "#4f46e5",
    primarySoft: "#eef2ff",
    secondaryColor: "#111827",
    accentColor: "#8b5cf6",
    sidebarColor: "#ffffff",
    sidebarText: "#4b5563",
    sidebarActive: "#eef2ff",
    sidebarActiveText: "#4f46e5",
  },
  rose: {
    name: "Rose",
    primaryColor: "#e11d48",
    primaryHover: "#be123c",
    primarySoft: "#fff1f2",
    secondaryColor: "#111827",
    accentColor: "#f43f5e",
    sidebarColor: "#ffffff",
    sidebarText: "#4b5563",
    sidebarActive: "#fff1f2",
    sidebarActiveText: "#be123c",
  },
  amber: {
    name: "Amber",
    primaryColor: "#d97706",
    primaryHover: "#b45309",
    primarySoft: "#fffbeb",
    secondaryColor: "#111827",
    accentColor: "#f59e0b",
    sidebarColor: "#ffffff",
    sidebarText: "#4b5563",
    sidebarActive: "#fffbeb",
    sidebarActiveText: "#b45309",
  },
};

export const statusColors = {
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626",
  info: "#0ea5e9",
};

export const defaultTheme = {
  mode: "light",
  preset: "neutral",
  radius: 8,
};
