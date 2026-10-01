import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Plus, Edit2, Eye, Trash2, Users, UserPlus, Save, X } from "lucide-react";
import {
  Card, CardHeader, Button, Badge, Modal, ConfirmDialog,
  Input, Textarea, Select, SearchBar, Tooltip, Alert,
} from "../../components/ui/index.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import { roles as seedRoles, adminUsers } from "../../mock/data.js";
import { permissionModules } from "../../constants/permissions.js";
import { useToast } from "../../hooks/useToast.jsx";

/* ============ ROLES LIST ============ */
export function RolesPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [roles, setRoles] = useState(seedRoles);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [assign, setAssign] = useState(null);

  const filtered = useMemo(
    () => roles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [roles, search]
  );

  const doDelete = () => {
    setRoles((all) => all.filter((r) => r.id !== confirm.id));
    toast.success("Role deleted");
    setConfirm(null);
  };

  const columns = [
    { name: "Role", sortable: true, selector: (r) => r.name, cell: (r) => <div className="font-medium text-main">{r.name}</div>, width: "180px" },
    { name: "Description", grow: 2, cell: (r) => <span className="text-xs text-muted">{r.description}</span> },
    { name: "Permissions", sortable: true, selector: (r) => r.permissionCount, cell: (r) => <Badge variant="muted">{r.permissionCount}</Badge>, width: "130px" },
    { name: "Users", sortable: true, selector: (r) => r.users, cell: (r) => <span className="tabular-nums">{r.users}</span>, width: "90px" },
    { name: "Status", sortable: true, selector: (r) => r.status, cell: (r) => <Badge variant={r.status === "Active" ? "success" : "muted"}>{r.status}</Badge>, width: "110px" },
    {
      name: "Actions",
      width: "160px",
      cell: (r) => (
        <div className="flex items-center gap-1">
          <Tooltip content="View"><button onClick={() => setViewing(r)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Eye size={14} /></button></Tooltip>
          <Tooltip content="Assign to admin"><button onClick={() => setAssign(r)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><UserPlus size={14} /></button></Tooltip>
          <Tooltip content="Edit"><button onClick={() => navigate("/roles/new")} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Edit2 size={14} /></button></Tooltip>
          <Tooltip content="Delete"><button onClick={() => setConfirm(r)} className="p-1.5 rounded hover:bg-app" style={{ color: "var(--color-danger)" }}><Trash2 size={14} /></button></Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search roles..." />
          </div>
          <Button as={Link} to="/roles/new"><Plus size={14} /> Create Role</Button>
        </div>
      </Card>

      <Card padded={false}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyIcon={Shield}
          emptyTitle="No roles"
          emptyDescription="Create a role to get started."
        />
      </Card>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={doDelete}
        title="Delete role?"
        message={`"${confirm?.name}" will be permanently deleted. Users assigned to this role will lose their permissions.`}
        confirmLabel="Delete"
        variant="danger"
      />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Role Details" size="lg">
        {viewing && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted uppercase">Role</div>
              <div className="text-lg font-semibold text-main">{viewing.name}</div>
              <div className="text-sm text-muted">{viewing.description}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Card padded={false} className="p-3"><div className="text-xs text-muted">Permissions</div><div className="text-lg font-semibold">{viewing.permissionCount}</div></Card>
              <Card padded={false} className="p-3"><div className="text-xs text-muted">Users</div><div className="text-lg font-semibold">{viewing.users}</div></Card>
              <Card padded={false} className="p-3"><div className="text-xs text-muted">Status</div><Badge variant={viewing.status === "Active" ? "success" : "muted"}>{viewing.status}</Badge></Card>
            </div>
          </div>
        )}
      </Modal>

      <AssignRoleModal role={assign} onClose={() => setAssign(null)} />
    </div>
  );
}

function AssignRoleModal({ role, onClose }) {
  const toast = useToast();
  const [selected, setSelected] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  if (!role) return null;

  const assign = () => {
    if (!selected) return setError("Please select an admin user.");
    const admin = adminUsers.find((a) => a.id === selected);
    setSuccess(`Role "${role.name}" assigned to ${admin?.name}.`);
    toast.success("Role assigned");
    setTimeout(onClose, 1200);
  };

  return (
    <Modal
      open={!!role}
      onClose={onClose}
      title={`Assign "${role.name}" to admin`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={assign}>Assign Role</Button>
        </>
      }
    >
      {success && <div className="mb-3"><Alert variant="success">{success}</Alert></div>}
      <Select label="Select Admin User" value={selected} onChange={(e) => { setSelected(e.target.value); setError(null); }} error={error} required>
        <option value="">Choose an admin...</option>
        {adminUsers.map((a) => <option key={a.id} value={a.id}>{a.name} — {a.email}</option>)}
      </Select>
    </Modal>
  );
}

/* ============ CREATE ROLE (PERMISSION MATRIX) ============ */
export function CreateRolePage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [perms, setPerms] = useState({}); // { moduleKey: { permission: true } }
  const [errors, setErrors] = useState({});

  const toggle = (mod, p) => {
    setPerms((cur) => {
      const m = cur[mod] || {};
      return { ...cur, [mod]: { ...m, [p]: !m[p] } };
    });
  };

  const toggleModule = (mod, ps, checked) => {
    setPerms((cur) => ({ ...cur, [mod]: Object.fromEntries(ps.map((p) => [p, checked])) }));
  };

  const isModuleAll = (mod, ps) => {
    const m = perms[mod] || {};
    return ps.every((p) => m[p]);
  };

  const allChecked = useMemo(() => permissionModules.every((mm) => isModuleAll(mm.key, mm.permissions)), [perms]);

  const toggleAll = (checked) => {
    const next = {};
    permissionModules.forEach((mm) => {
      next[mm.key] = Object.fromEntries(mm.permissions.map((p) => [p, checked]));
    });
    setPerms(next);
  };

  const totalSelected = permissionModules.reduce(
    (sum, mm) => sum + mm.permissions.filter((p) => perms[mm.key]?.[p]).length, 0
  );

  const save = () => {
    const e = {};
    if (!name.trim()) e.name = "Role name is required";
    if (totalSelected === 0) e.perms = "Select at least one permission";
    setErrors(e);
    if (Object.keys(e).length) return;
    toast.success("Role created");
    navigate("/roles");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Create Role" subtitle="Configure a new role and its permissions" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input label="Role name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
          </Select>
        </div>
        <div className="mt-3">
          <Textarea label="Description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-5 flex items-center justify-between border-b border-app">
          <div>
            <h3 className="font-semibold text-main">Permissions Matrix</h3>
            <p className="text-xs text-muted mt-0.5">
              {totalSelected} permission{totalSelected !== 1 ? "s" : ""} selected
              {errors.perms && <span className="ml-2" style={{ color: "var(--color-danger)" }}>· {errors.perms}</span>}
            </p>
          </div>
          <label className="text-sm flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)} />
            Select all
          </label>
        </div>
        <div className="divide-y divide-app">
          {permissionModules.map((m) => {
            const modAll = isModuleAll(m.key, m.permissions);
            return (
              <div key={m.key} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-main">{m.label}</div>
                  <label className="text-xs flex items-center gap-2 cursor-pointer text-muted">
                    <input
                      type="checkbox"
                      checked={modAll}
                      onChange={(e) => toggleModule(m.key, m.permissions, e.target.checked)}
                    />
                    Select all in module
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {m.permissions.map((p) => {
                    const active = !!perms[m.key]?.[p];
                    return (
                      <label
                        key={p}
                        className="px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer capitalize transition-all"
                        style={{
                          borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                          background: active ? "var(--color-primary-soft)" : "transparent",
                          color: active ? "var(--color-primary)" : "var(--color-text-muted)",
                        }}
                      >
                        <input type="checkbox" className="hidden" checked={active} onChange={() => toggle(m.key, p)} />
                        {p}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => navigate("/roles")}><X size={14} /> Cancel</Button>
        <Button onClick={save}><Save size={14} /> Create Role</Button>
      </div>
    </div>
  );
}

/* ============ PERMISSIONS PAGE ============ */
export function PermissionsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Permission Catalog"
          subtitle="All modules and permissions available in the system"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissionModules.map((m) => (
            <div key={m.key} className="border border-app rounded-lg p-4">
              <div className="font-semibold text-main mb-2">{m.label}</div>
              <div className="flex flex-wrap gap-1.5">
                {m.permissions.map((p) => (
                  <Badge key={p} variant="muted">{p}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
