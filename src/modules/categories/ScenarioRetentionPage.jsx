import { useState } from "react";
import { Clock, Save, X, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, Button, ConfirmDialog, Alert } from "../../components/ui/index.jsx";
import { retentionConfig } from "../../mock/data.js";
import { useToast } from "../../hooks/useToast.jsx";

const OPTIONS = [30, 60, 90, 120];

export default function ScenarioRetentionPage() {
  const toast = useToast();
  const [current, setCurrent] = useState(retentionConfig.days);
  const [selected, setSelected] = useState(retentionConfig.days);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const dirty = current !== selected;

  const save = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrent(selected);
      setLoading(false);
      setConfirmOpen(false);
      setSaved(true);
      toast.success("Retention period updated");
      setTimeout(() => setSaved(false), 3000);
    }, 700);
  };

  return (
    <div className="max-w-3xl space-y-4">
      <Card>
        <CardHeader title="Scenario Retention Period" subtitle="Choose how long completed scenarios are retained before being archived." />

        {saved && (
          <div className="mb-4">
            <Alert variant="success" title="Saved successfully">
              Retention set to <strong>{current} days</strong>. This will apply to the scenario lifecycle going forward.
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {OPTIONS.map((d) => {
            const active = selected === d;
            return (
              <button
                key={d}
                onClick={() => setSelected(d)}
                className="p-4 rounded-lg border-2 text-left transition-all"
                style={{
                  borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                  background: active ? "var(--color-primary-soft)" : "var(--color-card)",
                }}
              >
                <div className="flex items-center justify-between">
                  <Clock size={18} className={active ? "text-primary" : "text-muted"} />
                  {active && <CheckCircle2 size={18} className="text-primary" />}
                </div>
                <div className="mt-2 font-semibold text-main text-lg">{d} Days</div>
                <div className="text-xs text-muted mt-0.5">
                  {d === 30 ? "Short retention" : d === 60 ? "Standard" : d === 90 ? "Recommended" : "Extended"}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 p-3 rounded-lg text-sm" style={{ background: "var(--color-bg)" }}>
          <div className="text-muted">Current retention</div>
          <div className="font-semibold text-main">{current} days</div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setSelected(current)} disabled={!dirty}>
            <X size={14} /> Cancel
          </Button>
          <Button onClick={() => setConfirmOpen(true)} disabled={!dirty}>
            <Save size={14} /> Save Changes
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={save}
        loading={loading}
        title="Change retention period?"
        message={`Scenarios will now be retained for ${selected} days. Existing scenarios beyond this window may be affected.`}
        confirmLabel="Confirm & Save"
      />
    </div>
  );
}
