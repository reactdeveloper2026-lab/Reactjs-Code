import { useState } from "react";
import { Save, X, ShieldCheck } from "lucide-react";
import { Card, CardHeader, Button, Input, Switch, ConfirmDialog, Alert } from "../../components/ui/index.jsx";
import { defaultPasswordPolicy } from "../../mock/data.js";
import { useToast } from "../../hooks/useToast.jsx";

export default function PasswordPolicyPage() {
  const toast = useToast();
  const [policy, setPolicy] = useState(defaultPasswordPolicy);
  const [draft, setDraft] = useState(defaultPasswordPolicy);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(policy) !== JSON.stringify(draft);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const validate = () => {
    const e = {};
    if (draft.minLength < 4) e.minLength = "Minimum length must be at least 4";
    if (draft.maxLength <= draft.minLength) e.maxLength = "Max length must be greater than min length";
    if (draft.maxLength > 128) e.maxLength = "Max length cannot exceed 128";
    if (draft.expiryDays < 0) e.expiryDays = "Cannot be negative";
    if (draft.history < 0) e.history = "Cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openConfirm = () => { if (validate()) setConfirmOpen(true); };

  const save = () => {
    setPolicy(draft);
    setConfirmOpen(false);
    setSaved(true);
    toast.success("Password policy updated");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {saved && <Alert variant="success" title="Policy updated">The new password policy will apply to all new passwords going forward.</Alert>}

      <Card>
        <CardHeader title="Password Policy" subtitle="Global rules applied to every admin and app user password" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Minimum length" type="number" value={draft.minLength} onChange={(e) => set({ minLength: +e.target.value })} error={errors.minLength} />
          <Input label="Maximum length" type="number" value={draft.maxLength} onChange={(e) => set({ maxLength: +e.target.value })} error={errors.maxLength} />
          <Input label="Password expiry (days)" type="number" value={draft.expiryDays} onChange={(e) => set({ expiryDays: +e.target.value })} hint="0 = never expires" error={errors.expiryDays} />
          <Input label="Password history (# of previous passwords disallowed)" type="number" value={draft.history} onChange={(e) => set({ history: +e.target.value })} error={errors.history} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Character Requirements" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Requirement label="Must contain uppercase letter" checked={draft.uppercase} onChange={(v) => set({ uppercase: v })} />
          <Requirement label="Must contain lowercase letter" checked={draft.lowercase} onChange={(v) => set({ lowercase: v })} />
          <Requirement label="Must contain a number" checked={draft.numbers} onChange={(v) => set({ numbers: v })} />
          <Requirement label="Must contain a special character" checked={draft.specialChars} onChange={(v) => set({ specialChars: v })} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Initial Password Rules" subtitle="Applied to auto-generated first-time passwords for new users" />
        <div className="space-y-3">
          <Requirement label="Auto-generate initial password" checked={draft.initialPasswordAutoGenerate} onChange={(v) => set({ initialPasswordAutoGenerate: v })} />
          <Requirement label="Force password change on first login" checked={draft.firstLoginChange} onChange={(v) => set({ firstLoginChange: v })} />
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => setDraft(policy)} disabled={!dirty}><X size={14} /> Cancel</Button>
        <Button onClick={openConfirm} disabled={!dirty}><Save size={14} /> Save Policy</Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={save}
        title="Update password policy?"
        message="These changes will apply to all new passwords immediately. Existing passwords will remain valid until their next expiry."
        confirmLabel="Confirm & Save"
      />
    </div>
  );
}

function Requirement({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-app">
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-muted" />
        <span className="text-sm text-main">{label}</span>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}
