import { useEffect, useMemo, useState } from "react";
import { FolderTree, Plus, Edit2, Trash2, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card, Button, SearchBar, Badge, Modal, ConfirmDialog,
  Input, Textarea, Select, Tooltip,
} from "../../components/ui/index.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import { categories as seed } from "../../mock/data.js";
import { formatDateShort } from "../../utils/format.js";
import { useToast } from "../../hooks/useToast.jsx";

export default function CategoriesPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState(seed);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const filtered = useMemo(
    () => items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const openAdd = () => setForm({ mode: "add", data: { name: "", description: "", status: "Active" } });
  const openEdit = (c) => setForm({ mode: "edit", data: { ...c } });

  const save = (data) => {
    // Uniqueness check
    const nameTaken = items.some(
      (c) => c.name.toLowerCase() === data.name.trim().toLowerCase() && c.id !== data.id
    );
    if (nameTaken) return { name: "A category with this name already exists" };

    if (form.mode === "add") {
      setItems((all) => [
        {
          ...data,
          id: `cat_${Date.now()}`,
          questions: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...all,
      ]);
      toast.success("Category created");
    } else {
      setItems((all) => all.map((c) => (c.id === data.id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c)));
      toast.success("Category updated");
    }
    setForm(null);
    return null;
  };

  const doDelete = () => {
    setItems((all) => all.filter((c) => c.id !== confirm.id));
    toast.success("Category removed");
    setConfirm(null);
  };

  const columns = [
    {
      name: "Category",
      sortable: true,
      sortFunction: (a, b) => a.name.localeCompare(b.name),
      grow: 2,
      cell: (c) => (
        <div className="py-2">
          <div className="font-medium text-main">{c.name}</div>
          <div className="text-xs text-muted line-clamp-1">{c.description}</div>
        </div>
      ),
    },
    { name: "Status", sortable: true, selector: (c) => c.status, cell: (c) => <Badge variant={c.status === "Active" ? "success" : "muted"}>{c.status}</Badge>, width: "110px" },
    { name: "Questions", sortable: true, selector: (c) => c.questions, cell: (c) => <span className="tabular-nums">{c.questions}</span>, width: "120px" },
    { name: "Created", sortable: true, selector: (c) => c.createdAt, cell: (c) => <span className="text-xs text-muted">{formatDateShort(c.createdAt)}</span>, width: "130px" },
    { name: "Updated", sortable: true, selector: (c) => c.updatedAt, cell: (c) => <span className="text-xs text-muted">{formatDateShort(c.updatedAt)}</span>, width: "130px" },
    {
      name: "Actions",
      width: "150px",
      cell: (c) => (
        <div className="flex items-center gap-1">
          <Tooltip content="Configure messages"><button onClick={() => navigate("/categories/messages")} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Settings2 size={14} /></button></Tooltip>
          <Tooltip content="Edit"><button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Edit2 size={14} /></button></Tooltip>
          <Tooltip content="Remove"><button onClick={() => setConfirm(c)} className="p-1.5 rounded hover:bg-app" style={{ color: "var(--color-danger)" }}><Trash2 size={14} /></button></Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
          </div>
          <Button onClick={openAdd}><Plus size={14} /> Add Category</Button>
        </div>
      </Card>

      <Card padded={false}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyIcon={FolderTree}
          emptyTitle="No categories"
          emptyDescription="Create your first category to organize scenarios."
          emptyAction={<Button onClick={openAdd}><Plus size={14} /> Add Category</Button>}
        />
      </Card>

      <CategoryFormModal form={form} onClose={() => setForm(null)} onSave={save} />
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={doDelete}
        title="Remove category?"
        message={`This will remove "${confirm?.name}" and cannot be undone.`}
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  );
}

function CategoryFormModal({ form, onClose, onSave }) {
  const [data, setData] = useState(form?.data || {});
  const [errors, setErrors] = useState({});
  useEffect(() => { setData(form?.data || {}); setErrors({}); }, [form]);

  if (!form) return null;

  const submit = () => {
    const e = {};
    if (!data.name?.trim()) e.name = "Name is required";
    else if (data.name.length < 2) e.name = "Name is too short";
    setErrors(e);
    if (Object.keys(e).length) return;
    const err = onSave(data);
    if (err) setErrors(err);
  };

  return (
    <Modal
      open={!!form}
      onClose={onClose}
      title={form.mode === "add" ? "Add Category" : "Edit Category"}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{form.mode === "add" ? "Create" : "Save Changes"}</Button>
        </>
      }
    >
      <div className="space-y-3">
        <Input label="Category name" value={data.name || ""} onChange={(e) => setData({ ...data, name: e.target.value })} error={errors.name} required />
        <Textarea label="Description" value={data.description || ""} onChange={(e) => setData({ ...data, description: e.target.value })} />
        <Select label="Status" value={data.status || "Active"} onChange={(e) => setData({ ...data, status: e.target.value })}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
      </div>
    </Modal>
  );
}
