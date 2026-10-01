import { useEffect, useState, useMemo } from "react";
import { Plus, Edit2, Eye, CreditCard, CheckCircle2, X, Info } from "lucide-react";
import {
  Card, CardHeader, Button, Badge, Modal, ConfirmDialog,
  Input, Textarea, Select, Switch, Alert, EmptyState,
} from "../../components/ui/index.jsx";
import { subscriptionPlans as seed } from "../../mock/data.js";
import { formatCurrency, formatNumber } from "../../utils/format.js";
import { useToast } from "../../hooks/useToast.jsx";

export function SubscriptionPlansPage() {
  const toast = useToast();
  const [plans, setPlans] = useState(seed);
  const [form, setForm] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const totalActive = plans.filter((p) => p.status === "Active").length;
  const totalUsers = plans.reduce((s, p) => s + p.activeUsers, 0);
  const mrr = plans.reduce((s, p) => s + p.monthly * p.activeUsers, 0);

  const save = (data) => {
    if (form.mode === "add") {
      setPlans((all) => [...all, { ...data, id: `plan_${Date.now()}`, activeUsers: 0 }]);
      toast.success("Plan created");
    } else {
      setPlans((all) => all.map((p) => (p.id === data.id ? data : p)));
      toast.success("Plan updated");
    }
    setForm(null);
  };

  const toggleStatus = (p) => {
    setPlans((all) => all.map((x) => (x.id === p.id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x)));
    toast.info(`Plan ${p.status === "Active" ? "disabled" : "enabled"}`);
  };

  return (
    <div className="space-y-4">
      <Alert variant="warning" title="Subscription model pending client confirmation">
        The exact subscription model, pricing tiers and billing rules have not been finalized. This UI is flexible and will support the model chosen by the client.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-xs text-muted uppercase">Active Plans</div>
          <div className="text-2xl font-bold text-main mt-1">{totalActive}</div>
        </Card>
        <Card>
          <div className="text-xs text-muted uppercase">Subscribed Users</div>
          <div className="text-2xl font-bold text-main mt-1">{formatNumber(totalUsers)}</div>
        </Card>
        <Card>
          <div className="text-xs text-muted uppercase">Projected MRR</div>
          <div className="text-2xl font-bold text-main mt-1">{formatCurrency(mrr)}</div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Subscription Plans"
          subtitle="Manage the plans available to your users"
          action={<Button onClick={() => setForm({ mode: "add", data: { name: "", description: "", monthly: 0, yearly: 0, trialDays: 0, features: [], status: "Active" } })}><Plus size={14} /> Add Plan</Button>}
        />
        {plans.length === 0 ? (
          <EmptyState icon={CreditCard} title="No plans yet" description="Create your first subscription plan." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((p) => (
              <div
                key={p.id}
                className="border-2 rounded-xl p-5 flex flex-col"
                style={{ borderColor: p.status === "Active" ? "var(--color-primary)" : "var(--color-border)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-main text-lg">{p.name}</div>
                    <div className="text-xs text-muted mt-0.5">{p.description}</div>
                  </div>
                  <Badge variant={p.status === "Active" ? "success" : "muted"}>{p.status}</Badge>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-main tabular-nums">
                    {formatCurrency(p.monthly)}<span className="text-xs text-muted font-normal">/mo</span>
                  </div>
                  <div className="text-xs text-muted">
                    or {formatCurrency(p.yearly)}/yr {p.trialDays > 0 && `· ${p.trialDays}-day trial`}
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 flex-1">
                  {p.features.map((f, i) => (
                    <li key={i} className="text-sm text-main flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--color-success)" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-app flex items-center justify-between">
                  <span className="text-xs text-muted">{formatNumber(p.activeUsers)} active users</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setViewing(p)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Eye size={14} /></button>
                    <button onClick={() => setForm({ mode: "edit", data: { ...p } })} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Edit2 size={14} /></button>
                    <button onClick={() => setConfirm(p)} className="p-1.5 rounded hover:bg-app text-xs" style={{ color: p.status === "Active" ? "var(--color-danger)" : "var(--color-success)" }}>
                      {p.status === "Active" ? "Disable" : "Enable"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Plan Details" size="md">
        {viewing && (
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-muted uppercase">Plan</div>
              <div className="text-lg font-semibold text-main">{viewing.name}</div>
              <div className="text-muted">{viewing.description}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Info2 label="Monthly" value={formatCurrency(viewing.monthly)} />
              <Info2 label="Yearly" value={formatCurrency(viewing.yearly)} />
              <Info2 label="Trial" value={`${viewing.trialDays} days`} />
              <Info2 label="Active Users" value={formatNumber(viewing.activeUsers)} />
            </div>
            <div>
              <div className="text-xs text-muted uppercase mb-1">Features</div>
              <ul className="space-y-1">
                {viewing.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle2 size={12} style={{ color: "var(--color-success)" }} /> {f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      <PlanFormModal form={form} onClose={() => setForm(null)} onSave={save} />

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => { toggleStatus(confirm); setConfirm(null); }}
        title={confirm?.status === "Active" ? "Disable plan?" : "Enable plan?"}
        message={`${confirm?.name} will be ${confirm?.status === "Active" ? "hidden from new signups" : "made available to new signups"}.`}
        confirmLabel={confirm?.status === "Active" ? "Disable" : "Enable"}
        variant={confirm?.status === "Active" ? "danger" : "primary"}
      />
    </div>
  );
}

function Info2({ label, value }) {
  return (
    <div>
      <div className="text-xs text-muted uppercase">{label}</div>
      <div className="text-main mt-0.5">{value}</div>
    </div>
  );
}

function PlanFormModal({ form, onClose, onSave }) {
  const [data, setData] = useState(form?.data || {});
  const [feats, setFeats] = useState((form?.data?.features || []).join("\n"));
  const [errors, setErrors] = useState({});
  useEffect(() => { setData(form?.data || {}); setFeats((form?.data?.features || []).join("\n")); setErrors({}); }, [form]);

  if (!form) return null;

  const submit = () => {
    const e = {};
    if (!data.name?.trim()) e.name = "Name required";
    if (data.monthly == null || data.monthly < 0) e.monthly = "Enter a valid price";
    if (data.yearly == null || data.yearly < 0) e.yearly = "Enter a valid price";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({ ...data, features: feats.split("\n").map((f) => f.trim()).filter(Boolean) });
  };

  return (
    <Modal
      open={!!form}
      onClose={onClose}
      title={form.mode === "add" ? "Add Subscription Plan" : "Edit Plan"}
      size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={submit}>Save Plan</Button></>}
    >
      <div className="space-y-3">
        <Input label="Plan name" value={data.name || ""} onChange={(e) => setData({ ...data, name: e.target.value })} error={errors.name} required />
        <Textarea label="Description" rows={2} value={data.description || ""} onChange={(e) => setData({ ...data, description: e.target.value })} />
        <div className="grid grid-cols-3 gap-3">
          <Input label="Monthly price" type="number" step="0.01" value={data.monthly ?? 0} onChange={(e) => setData({ ...data, monthly: +e.target.value })} error={errors.monthly} />
          <Input label="Yearly price" type="number" step="0.01" value={data.yearly ?? 0} onChange={(e) => setData({ ...data, yearly: +e.target.value })} error={errors.yearly} />
          <Input label="Trial (days)" type="number" value={data.trialDays ?? 0} onChange={(e) => setData({ ...data, trialDays: +e.target.value })} />
        </div>
        <Textarea label="Features (one per line)" rows={4} value={feats} onChange={(e) => setFeats(e.target.value)} />
        <Select label="Status" value={data.status || "Active"} onChange={(e) => setData({ ...data, status: e.target.value })}>
          <option>Active</option>
          <option>Inactive</option>
        </Select>
      </div>
    </Modal>
  );
}

/* ============ SUBSCRIPTION SETTINGS ============ */
export function SubscriptionSettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState({
    trialEnabled: true,
    trialDays: 14,
    autoRenew: true,
    proration: true,
    gracePeriod: 7,
    currency: "USD",
    taxIncluded: false,
  });

  return (
    <div className="space-y-4 max-w-3xl">
      <Alert variant="info">Global settings that apply across all subscription plans.</Alert>

      <Card>
        <CardHeader title="Trial & Renewal" />
        <div className="space-y-3">
          <ToggleRow label="Free trial enabled globally" checked={settings.trialEnabled} onChange={(v) => setSettings({ ...settings, trialEnabled: v })} />
          <Input label="Default trial length (days)" type="number" value={settings.trialDays} onChange={(e) => setSettings({ ...settings, trialDays: +e.target.value })} />
          <ToggleRow label="Auto-renew subscriptions" checked={settings.autoRenew} onChange={(v) => setSettings({ ...settings, autoRenew: v })} />
          <ToggleRow label="Enable prorated upgrades / downgrades" checked={settings.proration} onChange={(v) => setSettings({ ...settings, proration: v })} />
          <Input label="Grace period after payment failure (days)" type="number" value={settings.gracePeriod} onChange={(e) => setSettings({ ...settings, gracePeriod: +e.target.value })} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Currency & Tax" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select label="Currency" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>INR</option>
          </Select>
          <div className="flex items-end">
            <ToggleRow label="Tax included in listed prices" checked={settings.taxIncluded} onChange={(v) => setSettings({ ...settings, taxIncluded: v })} />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Subscription settings saved")}>Save Settings</Button>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-app">
      <span className="text-sm text-main">{label}</span>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}
