import { useMemo, useState } from "react";
import { ScrollText, Eye, Download } from "lucide-react";
import {
  Card, Button, SearchBar, Badge, Modal, Select, Tooltip,
} from "../../components/ui/index.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import DateField from "../../components/ui/DateField.jsx";
import { auditLogs as seed } from "../../mock/data.js";
import { formatDate, initials } from "../../utils/format.js";
import { useToast } from "../../hooks/useToast.jsx";
import { ExportModal } from "../users/AppUsersPage.jsx";

export default function AuditLogPage() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [activity, setActivity] = useState("all");
  const [module, setModule] = useState("all");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportState, setExportState] = useState({ format: null, loading: false, done: false, error: null });

  const activities = ["LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "BLOCK", "UNBLOCK", "EXPORT"];
  const modules = ["User Management", "Category", "Subscription", "Payment", "Auth", "Role", "Settings"];
  const roles = ["Super Admin", "Admin", "Support Admin"];

  const filtered = useMemo(() => {
    let list = seed;
    if (search) list = list.filter((l) => l.user.toLowerCase().includes(search.toLowerCase()) || l.ip.includes(search));
    if (activity !== "all") list = list.filter((l) => l.activity === activity);
    if (module !== "all") list = list.filter((l) => l.module === module);
    if (status !== "all") list = list.filter((l) => l.status === status);
    if (role !== "all") list = list.filter((l) => l.role === role);
    if (dateFrom) list = list.filter((l) => new Date(l.timestamp) >= dateFrom);
    if (dateTo) list = list.filter((l) => new Date(l.timestamp) <= dateTo);
    return [...list].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [search, activity, module, status, role, dateFrom, dateTo]);

  const runExport = (format) => {
    setExportState({ format, loading: true, done: false, error: null });
    setTimeout(() => {
      if (!filtered.length) { setExportState({ format, loading: false, done: false, error: "No logs to export" }); return; }
      setExportState({ format, loading: false, done: true, error: null });
      toast.success(`Exported ${filtered.length} logs as ${format.toUpperCase()}`);
    }, 900);
  };

  const columns = [
    { name: "Date/Time", sortable: true, selector: (l) => l.timestamp, cell: (l) => <span className="text-xs text-muted whitespace-nowrap">{formatDate(l.timestamp)}</span>, width: "170px" },
    {
      name: "User",
      sortable: true,
      selector: (l) => l.user,
      grow: 2,
      cell: (l) => (
        <div className="flex items-center gap-2 py-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0" style={{ background: "var(--color-secondary)" }}>
            {initials(l.user)}
          </div>
          <div>
            <div className="text-sm font-medium text-main">{l.user}</div>
            <div className="text-xs text-muted">{l.role}</div>
          </div>
        </div>
      ),
    },
    { name: "Activity", sortable: true, selector: (l) => l.activity, cell: (l) => <Badge>{l.activity}</Badge>, width: "120px" },
    { name: "Module", sortable: true, selector: (l) => l.module, width: "160px" },
    {
      name: "IP / Device",
      cell: (l) => <div><div className="text-xs">{l.ip}</div><div className="text-xs text-muted">{l.device}</div></div>,
      width: "180px",
    },
    { name: "Status", sortable: true, selector: (l) => l.status, cell: (l) => <Badge variant={l.status === "Success" ? "success" : "danger"}>{l.status}</Badge>, width: "110px" },
    {
      name: "",
      width: "60px",
      cell: (l) => (
        <Tooltip content="View details">
          <button onClick={() => setViewing(l)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main">
            <Eye size={14} />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search user or IP..." />
          <Select value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="all">All activities</option>
            {activities.map((a) => <option key={a}>{a}</option>)}
          </Select>
          <Select value={module} onChange={(e) => setModule(e.target.value)}>
            <option value="all">All modules</option>
            {modules.map((m) => <option key={m}>{m}</option>)}
          </Select>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="all">All roles</option>
            {roles.map((r) => <option key={r}>{r}</option>)}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option>Success</option>
            <option>Failed</option>
          </Select>
          <DateField label="From" value={dateFrom} onChange={setDateFrom} />
          <DateField label="To" value={dateTo} onChange={setDateTo} />
          <div className="flex items-end">
            <Button variant="secondary" className="w-full" onClick={() => setExportOpen(true)}>
              <Download size={14} /> Export Logs
            </Button>
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyIcon={ScrollText}
          emptyTitle="No logs match your filters"
          emptyDescription="Try widening the date range or clearing filters."
        />
      </Card>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Audit Log Details" size="lg">
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Activity" value={<Badge>{viewing.activity}</Badge>} />
              <Field label="Status" value={<Badge variant={viewing.status === "Success" ? "success" : "danger"}>{viewing.status}</Badge>} />
              <Field label="User" value={viewing.user} />
              <Field label="Role" value={viewing.role} />
              <Field label="Module" value={viewing.module} />
              <Field label="Timestamp" value={formatDate(viewing.timestamp)} />
              <Field label="IP Address" value={viewing.ip} />
              <Field label="Device" value={viewing.device} />
              <div className="col-span-2">
                <div className="text-xs text-muted uppercase">Details</div>
                <div className="mt-1 text-main">{viewing.details}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted uppercase mb-1">Metadata</div>
                <pre className="text-xs p-3 rounded-lg overflow-x-auto" style={{ background: "var(--color-bg)" }}>
{JSON.stringify({ resourceId: viewing.id, sessionId: "sess_" + viewing.id.slice(-6), correlationId: "corr_" + viewing.id }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Card>
        <div className="flex flex-wrap gap-6 items-start">
          <div>
            <div className="text-xs uppercase text-muted">Retention</div>
            <div className="font-semibold text-main">180 days</div>
            <div className="text-xs text-muted mt-1">Logs are archived after 180 days.</div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted">Access</div>
            <div className="font-semibold text-main">Read-only</div>
            <div className="text-xs text-muted mt-1">Audit logs cannot be modified or deleted from the admin panel.</div>
          </div>
        </div>
      </Card>

      <ExportModal
        open={exportOpen}
        onClose={() => { setExportOpen(false); setExportState({ format: null, loading: false, done: false, error: null }); }}
        state={exportState}
        onExport={runExport}
        totalCount={filtered.length}
      />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs text-muted uppercase">{label}</div>
      <div className="mt-0.5 text-main">{value}</div>
    </div>
  );
}
