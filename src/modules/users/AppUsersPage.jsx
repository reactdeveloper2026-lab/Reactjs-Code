import { useMemo, useState } from "react";
import {
  Users as UsersIcon, Eye, Ban, CheckCircle2, Download,
  FileText, FileSpreadsheet,
} from "lucide-react";
import {
  Card, Button, SearchBar, Badge, Modal, ConfirmDialog,
  Select, Tooltip,
} from "../../components/ui/index.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import DateField from "../../components/ui/DateField.jsx";
import { appUsers as seedUsers } from "../../mock/data.js";
import { formatDate, formatDateShort, initials } from "../../utils/format.js";
import { useToast } from "../../hooks/useToast.jsx";

export default function AppUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState(seedUsers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sub, setSub] = useState("all");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [viewUser, setViewUser] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportState, setExportState] = useState({ format: null, loading: false, done: false, error: null });

  const filtered = useMemo(() => {
    let list = users;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }
    if (status !== "all") list = list.filter((u) => u.status === status);
    if (sub !== "all") list = list.filter((u) => u.subscription === sub);
    if (fromDate) list = list.filter((u) => new Date(u.createdAt) >= fromDate);
    if (toDate) list = list.filter((u) => new Date(u.createdAt) <= toDate);
    return list;
  }, [users, search, status, sub, fromDate, toDate]);

  const applyAction = () => {
    if (!confirm) return;
    setUsers((all) =>
      all.map((u) =>
        u.id === confirm.user.id ? { ...u, status: confirm.action === "block" ? "Blocked" : "Active" } : u
      )
    );
    toast.success(`User ${confirm.action === "block" ? "blocked" : "unblocked"} successfully`);
    setConfirm(null);
  };

  const runExport = (format) => {
    setExportState({ format, loading: true, done: false, error: null });
    setTimeout(() => {
      if (filtered.length === 0) {
        setExportState({ format, loading: false, done: false, error: "No data to export" });
        return;
      }
      setExportState({ format, loading: false, done: true, error: null });
      toast.success(`Exported ${filtered.length} users as ${format.toUpperCase()}`);
    }, 1200);
  };

  const columns = [
    {
      name: "User",
      sortable: true,
      sortFunction: (a, b) => a.name.localeCompare(b.name),
      grow: 2,
      cell: (u) => (
        <div className="flex items-center gap-2 py-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0" style={{ background: "var(--color-primary)" }}>
            {initials(u.name)}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-main truncate">{u.name}</div>
            <div className="text-xs text-muted truncate">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      sortable: true,
      selector: (u) => u.status,
      cell: (u) => (
        <Badge variant={u.status === "Active" ? "success" : u.status === "Blocked" ? "danger" : "warning"}>
          {u.status}
        </Badge>
      ),
      width: "110px",
    },
    {
      name: "Subscription",
      sortable: true,
      selector: (u) => u.subscription,
      cell: (u) => <Badge variant="muted">{u.subscription}</Badge>,
      width: "140px",
    },
    {
      name: "Created",
      sortable: true,
      selector: (u) => u.createdAt,
      cell: (u) => <span className="text-xs text-muted">{formatDateShort(u.createdAt)}</span>,
      width: "130px",
    },
    {
      name: "Last Active",
      sortable: true,
      selector: (u) => u.lastActive,
      cell: (u) => <span className="text-xs text-muted">{formatDate(u.lastActive)}</span>,
      width: "170px",
    },
    {
      name: "Actions",
      width: "120px",
      cell: (u) => (
        <div className="flex items-center gap-1">
          <Tooltip content="View"><button onClick={() => setViewUser(u)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Eye size={14} /></button></Tooltip>
          {u.status === "Blocked" ? (
            <Tooltip content="Unblock"><button onClick={() => setConfirm({ user: u, action: "unblock" })} className="p-1.5 rounded hover:bg-app" style={{ color: "var(--color-success)" }}><CheckCircle2 size={14} /></button></Tooltip>
          ) : (
            <Tooltip content="Block"><button onClick={() => setConfirm({ user: u, action: "block" })} className="p-1.5 rounded hover:bg-app" style={{ color: "var(--color-danger)" }}><Ban size={14} /></button></Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
          </div>
          <div className="w-32">
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </div>
          <div className="w-36">
            <Select label="Subscription" value={sub} onChange={(e) => setSub(e.target.value)}>
              <option value="all">All plans</option>
              <option value="Free">Free</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </Select>
          </div>
          <div className="w-40">
            <DateField label="Created from" value={fromDate} onChange={setFromDate} />
          </div>
          <div className="w-40">
            <DateField label="Created to" value={toDate} onChange={setToDate} />
          </div>
          <Button variant="secondary" onClick={() => setExportOpen(true)}>
            <Download size={14} /> Export
          </Button>
        </div>
      </Card>

      <Card padded={false}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyIcon={UsersIcon}
          emptyTitle="No users found"
          emptyDescription="Try adjusting your search or filters."
          emptyAction={
            <Button variant="secondary" onClick={() => { setSearch(""); setStatus("all"); setSub("all"); setFromDate(null); setToDate(null); }}>
              Reset filters
            </Button>
          }
        />
      </Card>

      {/* User Detail Modal */}
      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="User Details" size="lg">
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold" style={{ background: "var(--color-primary)" }}>
                {initials(viewUser.name)}
              </div>
              <div>
                <div className="font-semibold text-main text-lg">{viewUser.name}</div>
                <div className="text-sm text-muted">{viewUser.email}</div>
              </div>
              <div className="ml-auto">
                <Badge variant={viewUser.status === "Active" ? "success" : "danger"}>{viewUser.status}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="User ID" value={viewUser.id} />
              <Field label="Subscription" value={viewUser.subscription} />
              <Field label="Country" value={viewUser.country} />
              <Field label="Device" value={viewUser.device} />
              <Field label="Created" value={formatDate(viewUser.createdAt)} />
              <Field label="Last Active" value={formatDate(viewUser.lastActive)} />
              <Field label="Scenarios Completed" value={viewUser.scenariosCompleted} />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={applyAction}
        title={confirm?.action === "block" ? "Block user?" : "Unblock user?"}
        message={confirm?.action === "block"
          ? `${confirm?.user.name} will no longer be able to access the app.`
          : `${confirm?.user.name} will regain access to the app.`}
        confirmLabel={confirm?.action === "block" ? "Yes, block" : "Yes, unblock"}
        variant={confirm?.action === "block" ? "danger" : "primary"}
      />

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
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="text-main mt-0.5">{value ?? "-"}</div>
    </div>
  );
}

export function ExportModal({ open, onClose, state, onExport, totalCount }) {
  return (
    <Modal open={open} onClose={onClose} title="Export data" size="md">
      <p className="text-sm text-muted">
        Export the current filtered view ({totalCount} records) as PDF or Excel.
        This is a mocked UI action — no file will actually be downloaded.
      </p>
      {state.error && (
        <div className="mt-3">
          <div className="text-sm p-2 rounded" style={{ background: "rgba(220,38,38,.08)", color: "var(--color-danger)" }}>
            {state.error}
          </div>
        </div>
      )}
      {state.done && (
        <div className="mt-3">
          <div className="text-sm p-2 rounded" style={{ background: "rgba(22,163,74,.08)", color: "var(--color-success)" }}>
            Export ready! ({state.format?.toUpperCase()})
          </div>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          onClick={() => onExport("pdf")}
          loading={state.loading && state.format === "pdf"}
          disabled={totalCount === 0 || state.loading}
        >
          <FileText size={14} /> Export as PDF
        </Button>
        <Button
          variant="secondary"
          onClick={() => onExport("excel")}
          loading={state.loading && state.format === "excel"}
          disabled={totalCount === 0 || state.loading}
        >
          <FileSpreadsheet size={14} /> Export as Excel
        </Button>
      </div>
      {totalCount === 0 && (
        <p className="mt-3 text-xs" style={{ color: "var(--color-warning)" }}>
          No records to export. Adjust your filters and try again.
        </p>
      )}
    </Modal>
  );
}
