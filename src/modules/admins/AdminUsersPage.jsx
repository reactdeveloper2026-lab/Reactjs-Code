import { useEffect, useMemo, useState } from "react";
import { UserCog, Plus, Edit2, Ban, CheckCircle2, Eye, Download } from "lucide-react";
import {
  Card, Button, SearchBar, Badge, Modal, ConfirmDialog,
  Input, Select, Tooltip,
} from "../../components/ui/index.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import { adminUsers as seed } from "../../mock/data.js";
import { formatDate, formatDateShort, initials } from "../../utils/format.js";
import { useToast } from "../../hooks/useToast.jsx";
import { ExportModal } from "../users/AppUsersPage.jsx";

const ROLES = ["Super Admin", "Admin", "Support Admin", "Custom Role"];

export default function AdminUsersPage() {
  const toast = useToast();
  const [admins, setAdmins] = useState(seed);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  const [form, setForm] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportState, setExportState] = useState({ format: null, loading: false, done: false, error: null });

  const filtered = useMemo(() => {
    let list = admins;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s));
    }
    if (role !== "all") list = list.filter((a) => a.role === role);
    if (status !== "all") list = list.filter((a) => a.status === status);
    return list;
  }, [admins, search, role, status]);

  const openAdd = () =>
    setForm({ mode: "add", data: { name: "", email: "", role: "Admin", status: "Active", department: "Operations" } });
  const openEdit = (a) => setForm({ mode: "edit", data: { ...a } });

  const saveForm = (payload) => {
    if (form.mode === "add") {
      const newAdmin = {
        ...payload,
        id: `adm_${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setAdmins((all) => [newAdmin, ...all]);
      toast.success("Admin user created");
    } else {
      setAdmins((all) => all.map((a) => (a.id === payload.id ? payload : a)));
      toast.success("Admin user updated");
    }
    setForm(null);
  };

  const doConfirm = () => {
    setAdmins((all) =>
      all.map((a) =>
        a.id === confirm.admin.id ? { ...a, status: confirm.action === "block" ? "Blocked" : "Active" } : a
      )
    );
    toast.success(`Admin ${confirm.action === "block" ? "blocked" : "unblocked"}`);
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
      toast.success(`Exported ${filtered.length} admins as ${format.toUpperCase()}`);
    }, 1200);
  };

  const columns = [
    {
      name: "Admin",
      sortable: true,
      sortFunction: (a, b) => a.name.localeCompare(b.name),
      grow: 2,
      cell: (a) => (
        <div className="flex items-center gap-2 py-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: "var(--color-secondary)" }}>
            {initials(a.name)}
          </div>
          <div>
            <div className="font-medium text-main">{a.name}</div>
            <div className="text-xs text-muted">{a.email}</div>
          </div>
        </div>
      ),
    },
    { name: "Role", sortable: true, selector: (a) => a.role, cell: (a) => <Badge>{a.role}</Badge>, width: "140px" },
    { name: "Department", sortable: true, selector: (a) => a.department, width: "130px" },
    { name: "Status", sortable: true, selector: (a) => a.status, cell: (a) => <Badge variant={a.status === "Active" ? "success" : "danger"}>{a.status}</Badge>, width: "110px" },
    { name: "Created", sortable: true, selector: (a) => a.createdAt, cell: (a) => <span className="text-xs text-muted">{formatDateShort(a.createdAt)}</span>, width: "130px" },
    { name: "Last Login", sortable: true, selector: (a) => a.lastLogin, cell: (a) => <span className="text-xs text-muted">{formatDate(a.lastLogin)}</span>, width: "170px" },
    {
      name: "Actions",
      width: "140px",
      cell: (a) => (
        <div className="flex items-center gap-1">
          <Tooltip content="View"><button onClick={() => setViewing(a)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Eye size={14} /></button></Tooltip>
          <Tooltip content="Edit"><button onClick={() => openEdit(a)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Edit2 size={14} /></button></Tooltip>
          {a.status === "Blocked" ? (
            <Tooltip content="Unblock"><button onClick={() => setConfirm({ admin: a, action: "unblock" })} className="p-1.5 rounded hover:bg-app" style={{ color: "var(--color-success)" }}><CheckCircle2 size={14} /></button></Tooltip>
          ) : (
            <Tooltip content="Block"><button onClick={() => setConfirm({ admin: a, action: "block" })} className="p-1.5 rounded hover:bg-app" style={{ color: "var(--color-danger)" }}><Ban size={14} /></button></Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search admin users..." />
          </div>
          <div className="w-40">
            <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="all">All roles</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </Select>
          </div>
          <div className="w-32">
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </Select>
          </div>
          <Button variant="secondary" onClick={() => setExportOpen(true)}><Download size={14} /> Export</Button>
          <Button onClick={openAdd}><Plus size={14} /> Add Admin</Button>
        </div>
      </Card>

      <Card padded={false}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyIcon={UserCog}
          emptyTitle="No admin users"
          emptyDescription="Add a new admin to get started."
          emptyAction={<Button onClick={openAdd}><Plus size={14} /> Add Admin</Button>}
        />
      </Card>

      <AdminFormModal form={form} onClose={() => setForm(null)} onSave={saveForm} />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Admin Details" size="md">
        {viewing && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold" style={{ background: "var(--color-secondary)" }}>
                {initials(viewing.name)}
              </div>
              <div>
                <div className="font-semibold text-main text-lg">{viewing.name}</div>
                <div className="text-sm text-muted">{viewing.email}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs text-muted uppercase">Role</div><Badge>{viewing.role}</Badge></div>
              <div><div className="text-xs text-muted uppercase">Status</div><Badge variant={viewing.status === "Active" ? "success" : "danger"}>{viewing.status}</Badge></div>
              <div><div className="text-xs text-muted uppercase">Department</div>{viewing.department}</div>
              <div><div className="text-xs text-muted uppercase">Created</div>{formatDate(viewing.createdAt)}</div>
              <div><div className="text-xs text-muted uppercase">Last Login</div>{formatDate(viewing.lastLogin)}</div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={doConfirm}
        title={confirm?.action === "block" ? "Block admin?" : "Unblock admin?"}
        message={`Are you sure you want to ${confirm?.action} ${confirm?.admin.name}?`}
        confirmLabel={confirm?.action === "block" ? "Block" : "Unblock"}
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

function AdminFormModal({ form, onClose, onSave }) {
  const [data, setData] = useState(form?.data || {});
  const [errors, setErrors] = useState({});

  useEffect(() => { setData(form?.data || {}); setErrors({}); }, [form]);

  if (!form) return null;

  const validate = () => {
    const e = {};
    if (!data.name?.trim()) e.name = "Name is required";
    if (!data.email?.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email";
    if (!data.role) e.role = "Role is required";
    setErrors(e);
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) return;
    onSave(data);
  };

  return (
    <Modal
      open={!!form}
      onClose={onClose}
      title={form.mode === "add" ? "Add Admin User" : "Edit Admin User"}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{form.mode === "add" ? "Create Admin" : "Save Changes"}</Button>
        </>
      }
    >
      <div className="space-y-3">
        <Input label="Name" value={data.name || ""} onChange={(e) => setData({ ...data, name: e.target.value })} error={errors.name} required />
        <Input label="Email" type="email" value={data.email || ""} onChange={(e) => setData({ ...data, email: e.target.value })} error={errors.email} required />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Role" value={data.role || ""} onChange={(e) => setData({ ...data, role: e.target.value })} error={errors.role} required>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
          <Select label="Status" value={data.status || "Active"} onChange={(e) => setData({ ...data, status: e.target.value })}>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </Select>
        </div>
        <Select label="Department" value={data.department || "Operations"} onChange={(e) => setData({ ...data, department: e.target.value })}>
          <option>Operations</option>
          <option>Support</option>
          <option>Product</option>
          <option>Engineering</option>
        </Select>
        {form.mode === "add" && (
          <div className="text-xs text-muted p-3 rounded-lg" style={{ background: "var(--color-bg)" }}>
            A temporary password will be generated based on the password policy and emailed to the user.
          </div>
        )}
      </div>
    </Modal>
  );
}
