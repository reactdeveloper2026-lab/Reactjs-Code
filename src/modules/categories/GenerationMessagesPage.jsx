import { useEffect, useMemo, useState } from "react";
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown, Copy } from "lucide-react";
import {
  Card, CardHeader, Button, Select, Modal, ConfirmDialog, Textarea, Switch, Badge, EmptyState, Tooltip,
} from "../../components/ui/index.jsx";
import { categories, generationMessages as seed, placeholders } from "../../mock/data.js";
import { useToast } from "../../hooks/useToast.jsx";

export default function GenerationMessagesPage() {
  const toast = useToast();
  const [category, setCategory] = useState(categories[0].id);
  const [messages, setMessages] = useState(seed);
  const [form, setForm] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const list = useMemo(
    () => messages.filter((m) => m.categoryId === category).sort((a, b) => a.order - b.order),
    [messages, category]
  );

  const move = (id, dir) => {
    setMessages((all) => {
      const list = all.filter((m) => m.categoryId === category).sort((a, b) => a.order - b.order);
      const idx = list.findIndex((m) => m.id === id);
      const swap = idx + dir;
      if (swap < 0 || swap >= list.length) return all;
      const a = list[idx]; const b = list[swap];
      return all.map((m) => {
        if (m.id === a.id) return { ...m, order: b.order };
        if (m.id === b.id) return { ...m, order: a.order };
        return m;
      });
    });
  };

  const toggle = (id) => setMessages((all) => all.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)));

  const save = (data) => {
    if (form.mode === "add") {
      const nextOrder = (list[list.length - 1]?.order || 0) + 1;
      setMessages((all) => [...all, { id: `gm_${Date.now()}`, categoryId: category, order: nextOrder, enabled: true, ...data }]);
      toast.success("Message added");
    } else {
      setMessages((all) => all.map((m) => (m.id === data.id ? { ...m, ...data } : m)));
      toast.success("Message updated");
    }
    setForm(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-64">
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div className="flex-1" />
          <Button onClick={() => setForm({ mode: "add", data: { text: "", enabled: true } })}>
            <Plus size={14} /> Add Message
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card padded={false} className="lg:col-span-2">
          <div className="p-5">
            <CardHeader title="Generation Messages" subtitle="Drag or use arrows to reorder. Placeholders are supported." />
          </div>
          {list.length === 0 ? (
            <EmptyState title="No messages configured" description="Add a message to get started for this category." />
          ) : (
            <div className="divide-y divide-app">
              {list.map((m, i) => (
                <div key={m.id} className="px-5 py-4 flex items-start gap-3">
                  <div className="flex flex-col">
                    <Tooltip content="Move up">
                      <button disabled={i === 0} onClick={() => move(m.id, -1)} className="p-1 text-muted hover:text-main disabled:opacity-30">
                        <ChevronUp size={14} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Move down">
                      <button disabled={i === list.length - 1} onClick={() => move(m.id, 1)} className="p-1 text-muted hover:text-main disabled:opacity-30">
                        <ChevronDown size={14} />
                      </button>
                    </Tooltip>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="muted">#{m.order}</Badge>
                      {!m.enabled && <Badge variant="warning">Disabled</Badge>}
                    </div>
                    <div className="text-sm text-main">{m.text}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Switch checked={m.enabled} onChange={() => toggle(m.id)} />
                    <button onClick={() => setForm({ mode: "edit", data: m })} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Edit2 size={14} /></button>
                    <button onClick={() => setConfirm(m)} className="p-1.5 rounded hover:bg-app" style={{ color: "var(--color-danger)" }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Available Placeholders" subtitle="Use these tokens to insert dynamic content" />
          <div className="space-y-2">
            {placeholders.map((p) => (
              <div key={p.key} className="p-3 rounded-lg border border-app flex items-start gap-2">
                <code className="text-xs px-2 py-1 rounded font-mono" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
                  {p.key}
                </code>
                <div className="text-xs text-muted flex-1">{p.description}</div>
                <button
                  onClick={() => { navigator.clipboard?.writeText(p.key); toast.info("Copied to clipboard"); }}
                  className="text-muted hover:text-main"
                >
                  <Copy size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs p-2 rounded-lg" style={{ background: "var(--color-bg)", color: "var(--color-text-muted)" }}>
            These placeholders will be replaced by real values from the backend at runtime.
          </div>
        </Card>
      </div>

      <MessageFormModal form={form} onClose={() => setForm(null)} onSave={save} />
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => { setMessages((all) => all.filter((m) => m.id !== confirm.id)); toast.success("Message removed"); setConfirm(null); }}
        title="Remove message?"
        message="This message will be permanently removed."
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  );
}

function MessageFormModal({ form, onClose, onSave }) {
  const [data, setData] = useState(form?.data || {});
  const [error, setError] = useState(null);
  useEffect(() => { setData(form?.data || {}); setError(null); }, [form]);

  if (!form) return null;

  return (
    <Modal
      open={!!form}
      onClose={onClose}
      title={form.mode === "add" ? "Add Generation Message" : "Edit Generation Message"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (!data.text?.trim()) return setError("Message text is required");
              onSave(data);
            }}
          >Save</Button>
        </>
      }
    >
      <Textarea
        label="Message text"
        rows={5}
        value={data.text || ""}
        onChange={(e) => setData({ ...data, text: e.target.value })}
        error={error}
        placeholder="e.g. Hi {{userName}}, let's begin with {{scenarioName}}."
        required
      />
      <div className="mt-3">
        <Switch checked={!!data.enabled} onChange={(v) => setData({ ...data, enabled: v })} label="Enabled" />
      </div>
    </Modal>
  );
}
