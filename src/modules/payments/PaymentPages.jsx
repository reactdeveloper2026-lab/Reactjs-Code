import { useMemo, useState } from "react";
import { Eye, Receipt, TrendingUp } from "lucide-react";
import {
  Card, CardHeader, SearchBar, Badge, Modal,
  Select, Alert, Input, Button, Switch,
} from "../../components/ui/index.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import { transactions as seed } from "../../mock/data.js";
import { formatCurrency, formatDate } from "../../utils/format.js";
import { useToast } from "../../hooks/useToast.jsx";

const statusVariant = { Successful: "success", Pending: "warning", Failed: "danger", Refunded: "info" };

/* ============ TRANSACTIONS ============ */
export function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [viewing, setViewing] = useState(null);

  const filtered = useMemo(() => {
    let list = seed;
    if (search) list = list.filter((t) => t.user.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search));
    if (status !== "all") list = list.filter((t) => t.status === status);
    if (plan !== "all") list = list.filter((t) => t.plan === plan);
    return list;
  }, [search, status, plan]);

  const totalRevenue = seed.filter((t) => t.status === "Successful").reduce((s, t) => s + t.amount, 0);
  const pending = seed.filter((t) => t.status === "Pending").length;
  const failed = seed.filter((t) => t.status === "Failed").length;

  const columns = [
    { name: "Transaction ID", sortable: true, selector: (t) => t.id, cell: (t) => <span className="font-mono text-xs">{t.id}</span>, width: "160px" },
    { name: "Date", sortable: true, selector: (t) => t.date, cell: (t) => <span className="text-xs text-muted">{formatDate(t.date)}</span>, width: "170px" },
    {
      name: "User",
      sortable: true,
      selector: (t) => t.user,
      grow: 2,
      cell: (t) => (
        <div className="py-2">
          <div className="font-medium text-main">{t.user}</div>
          <div className="text-xs text-muted">{t.email}</div>
        </div>
      ),
    },
    { name: "Plan", sortable: true, selector: (t) => t.plan, cell: (t) => <Badge variant="muted">{t.plan}</Badge>, width: "110px" },
    { name: "Amount", sortable: true, selector: (t) => t.amount, cell: (t) => <span className="font-semibold tabular-nums">{formatCurrency(t.amount, t.currency)}</span>, width: "110px" },
    { name: "Status", sortable: true, selector: (t) => t.status, cell: (t) => <Badge variant={statusVariant[t.status]}>{t.status}</Badge>, width: "120px" },
    {
      name: "",
      width: "60px",
      cell: (t) => <button onClick={() => setViewing(t)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Eye size={14} /></button>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-xs text-muted uppercase">Total Revenue (all-time)</div>
          <div className="text-2xl font-bold text-main mt-1">{formatCurrency(totalRevenue)}</div>
          <div className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--color-success)" }}>
            <TrendingUp size={12} /> +12.4% vs last month
          </div>
        </Card>
        <Card>
          <div className="text-xs text-muted uppercase">Pending</div>
          <div className="text-2xl font-bold text-main mt-1">{pending}</div>
        </Card>
        <Card>
          <div className="text-xs text-muted uppercase">Failed</div>
          <div className="text-2xl font-bold text-main mt-1">{failed}</div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by user or transaction ID..." />
          </div>
          <div className="w-40">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option>Successful</option>
              <option>Pending</option>
              <option>Failed</option>
              <option>Refunded</option>
            </Select>
          </div>
          <div className="w-40">
            <Select value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="all">All plans</option>
              <option>Basic</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyIcon={Receipt}
          emptyTitle="No transactions"
          emptyDescription="Transactions will appear here once payments are processed."
        />
      </Card>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Transaction Details" size="md">
        {viewing && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <F label="Transaction ID" value={<span className="font-mono">{viewing.id}</span>} />
              <F label="Status" value={<Badge variant={statusVariant[viewing.status]}>{viewing.status}</Badge>} />
              <F label="User" value={viewing.user} />
              <F label="Email" value={viewing.email} />
              <F label="Plan" value={viewing.plan} />
              <F label="Amount" value={formatCurrency(viewing.amount, viewing.currency)} />
              <F label="Gateway" value={<Badge variant="warning">{viewing.gateway}</Badge>} />
              <F label="Date" value={formatDate(viewing.date)} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function F({ label, value }) {
  return <div><div className="text-xs text-muted uppercase">{label}</div><div className="text-main mt-0.5">{value}</div></div>;
}

/* ============ PAYMENT SETTINGS ============ */
export function PaymentSettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState({
    testMode: true,
    autoRefund: false,
    receiptEmails: true,
    currency: "USD",
    webhookUrl: "https://api.example.com/webhooks/payment",
  });

  return (
    <div className="space-y-4 max-w-3xl">
      <Alert variant="warning" title="Payment Gateway — Pending Client Confirmation">
        A single payment gateway will be integrated once the client confirms their choice. The UI below is a flexible placeholder that can be adapted to any provider (Stripe, Razorpay, PayPal, etc.).
      </Alert>

      <Card>
        <CardHeader title="Gateway Configuration" subtitle="Placeholder settings — replace when integrating" />
        <div className="space-y-3">
          <Input label="API Key (placeholder)" placeholder="sk_test_..." disabled />
          <Input label="Webhook Endpoint" value={settings.webhookUrl} onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })} />
          <Select label="Default Currency" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}>
            <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
          </Select>
          <ToggleRow label="Test / Sandbox Mode" checked={settings.testMode} onChange={(v) => setSettings({ ...settings, testMode: v })} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Behavior" />
        <div className="space-y-3">
          <ToggleRow label="Auto-refund on failed subscription" checked={settings.autoRefund} onChange={(v) => setSettings({ ...settings, autoRefund: v })} />
          <ToggleRow label="Send receipt emails" checked={settings.receiptEmails} onChange={(v) => setSettings({ ...settings, receiptEmails: v })} />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Payment settings saved")}>Save Settings</Button>
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
