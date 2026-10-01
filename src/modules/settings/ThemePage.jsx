import { Card, CardHeader, Button, Switch } from "../../components/ui/index.jsx";
import { Check, Sun, Moon, Palette } from "lucide-react";
import { useTheme } from "../../theme/ThemeProvider.jsx";
import { useToast } from "../../hooks/useToast.jsx";

export default function ThemePage() {
  const { theme, presets, setPreset, setMode, setRadius, reset } = useTheme();
  const toast = useToast();

  return (
    <div className="space-y-4 max-w-5xl">
      <Card>
        <CardHeader
          title="Theme & Appearance"
          subtitle="Customize the look and feel of your Admin Panel. Changes apply instantly across the entire application."
        />

        {/* Mode */}
        <div className="space-y-2">
          <div className="text-xs uppercase text-muted font-semibold">Appearance mode</div>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              onClick={() => setMode("light")}
              className="p-4 rounded-lg border-2 flex items-center gap-3"
              style={{ borderColor: theme.mode === "light" ? "var(--color-primary)" : "var(--color-border)" }}
            >
              <Sun size={20} className={theme.mode === "light" ? "text-primary" : "text-muted"} />
              <div className="text-left">
                <div className="font-medium text-main">Light</div>
                <div className="text-xs text-muted">Bright and clean</div>
              </div>
              {theme.mode === "light" && <Check size={16} className="ml-auto text-primary" />}
            </button>
            <button
              onClick={() => setMode("dark")}
              className="p-4 rounded-lg border-2 flex items-center gap-3"
              style={{ borderColor: theme.mode === "dark" ? "var(--color-primary)" : "var(--color-border)" }}
            >
              <Moon size={20} className={theme.mode === "dark" ? "text-primary" : "text-muted"} />
              <div className="text-left">
                <div className="font-medium text-main">Dark</div>
                <div className="text-xs text-muted">Easier on the eyes</div>
              </div>
              {theme.mode === "dark" && <Check size={16} className="ml-auto text-primary" />}
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Color Preset"
          subtitle="Choose a color palette. Each preset updates primary, accent and sidebar colors together."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(presets).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setPreset(key)}
              className="p-4 rounded-lg border-2 text-left transition-all"
              style={{
                borderColor: theme.preset === key ? p.primaryColor : "var(--color-border)",
                background: theme.preset === key ? "var(--color-primary-soft)" : "var(--color-card)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-main">{p.name}</div>
                {theme.preset === key && <Check size={16} style={{ color: p.primaryColor }} />}
              </div>
              <div className="flex gap-1.5">
                <Swatch color={p.primaryColor} label="Primary" />
                <Swatch color={p.accentColor} label="Accent" />
                <Swatch color={p.primarySoft} label="Soft" bordered />
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Border Radius" subtitle="Round corners across components" />
        <div className="flex flex-wrap gap-2">
          {[0, 4, 8, 10, 14, 20].map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className="px-4 py-2 border-2 text-sm font-medium"
              style={{
                borderRadius: r,
                borderColor: theme.radius === r ? "var(--color-primary)" : "var(--color-border)",
                color: theme.radius === r ? "var(--color-primary)" : "var(--color-text)",
              }}
            >
              {r}px
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Preview"
          subtitle="Sample components to see how the theme looks"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-app rounded-lg space-y-3">
            <div className="flex gap-2 flex-wrap">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
              <Button size="sm" variant="outline">Outline</Button>
              <Button size="sm" variant="danger">Danger</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 rounded-full text-xs" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>Default</span>
              <span className="px-2 py-1 rounded-full text-xs" style={{ background: "rgba(22,163,74,.1)", color: "var(--color-success)" }}>Success</span>
              <span className="px-2 py-1 rounded-full text-xs" style={{ background: "rgba(245,158,11,.1)", color: "var(--color-warning)" }}>Warning</span>
              <span className="px-2 py-1 rounded-full text-xs" style={{ background: "rgba(220,38,38,.1)", color: "var(--color-danger)" }}>Danger</span>
            </div>
            <Switch checked onChange={() => {}} label="Sample toggle" />
          </div>
          <div className="p-4 border border-app rounded-lg">
            <div className="text-xs uppercase text-muted mb-1">Card preview</div>
            <h3 className="font-semibold text-main">Weekly stats</h3>
            <div className="text-2xl font-bold mt-2 text-primary">$12,480</div>
            <div className="text-xs text-muted">+8.4% vs last week</div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => { reset(); toast.info("Theme reset to defaults"); }}>
          Reset to defaults
        </Button>
        <div className="text-xs text-muted flex items-center gap-1">
          <Palette size={12} /> Preferences are saved to your browser
        </div>
      </div>
    </div>
  );
}

function Swatch({ color, label, bordered }) {
  return (
    <div className="flex-1">
      <div
        className="w-full h-8 rounded"
        style={{
          background: color,
          border: bordered ? "1px solid var(--color-border)" : undefined,
        }}
        title={label}
      />
    </div>
  );
}
