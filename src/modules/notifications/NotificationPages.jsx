import { useEffect, useState } from "react";
import { Plus, Edit2, Eye, Bell, Mail } from "lucide-react";
import {
  Card, CardHeader, Button, Badge, Modal, Input, Textarea, Switch, Select, EmptyState,
} from "../../components/ui/index.jsx";
import { emailNotifications, inAppNotifications } from "../../mock/data.js";
import { formatDate } from "../../utils/format.js";
import { useToast } from "../../hooks/useToast.jsx";

/* ============ EMAIL NOTIFICATIONS ============ */
export function EmailNotificationsPage() {
  const toast = useToast();
  const [items, setItems] = useState(emailNotifications);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);

  const toggle = (id) => setItems((all) => all.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i)));

  const save = (data) => {
    setItems((all) => all.map((i) => (i.id === data.id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i)));
    toast.success("Email template updated");
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <Card padded={false}>
        <div className="p-5">
          <CardHeader title="Email Notifications" subtitle="Templates sent to users via email" />
        </div>
        {items.length === 0 ? (
          <EmptyState icon={Mail} title="No email templates" />
        ) : (
          <div className="divide-y divide-app">
            {items.map((n) => (
              <div key={n.id} className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
                  <Mail size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium text-main">{n.name}</div>
                    <Badge variant={n.enabled ? "success" : "muted"}>{n.enabled ? "Enabled" : "Disabled"}</Badge>
                  </div>
                  <div className="text-xs text-muted mt-1">Subject: {n.subject}</div>
                  <div className="text-xs text-muted mt-0.5">Last updated {formatDate(n.updatedAt)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={n.enabled} onChange={() => toggle(n.id)} />
                  <button onClick={() => setPreview(n)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Eye size={14} /></button>
                  <button onClick={() => setEditing(n)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Edit2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <TemplateEditor editing={editing} onClose={() => setEditing(null)} onSave={save} />

      <Modal open={!!preview} onClose={() => setPreview(null)} title={`Preview — ${preview?.name || ""}`} size="lg">
        {preview && (
          <div className="border border-app rounded-lg p-5" style={{ background: "var(--color-bg)" }}>
            <div className="text-xs text-muted">Subject</div>
            <div className="font-semibold text-main mb-3">{preview.subject.replace(/{{userName}}/g, "Aarav")}</div>
            <div className="text-sm text-main whitespace-pre-wrap">{preview.body.replace(/{{userName}}/g, "Aarav").replace(/{{otp}}/g, "483920")}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function TemplateEditor({ editing, onClose, onSave }) {
  const [data, setData] = useState(editing || {});
  const [errors, setErrors] = useState({});
  useEffect(() => { setData(editing || {}); setErrors({}); }, [editing]);
  if (!editing) return null;

  const submit = () => {
    const e = {};
    if (!data.subject?.trim()) e.subject = "Subject required";
    if (!data.body?.trim()) e.body = "Body required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(data);
  };

  return (
    <Modal
      open={!!editing}
      onClose={onClose}
      title={`Edit — ${editing.name}`}
      size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={submit}>Save Template</Button></>}
    >
      <div className="space-y-3">
        <Input label="Subject" value={data.subject || editing.subject} onChange={(e) => setData({ ...data, id: editing.id, subject: e.target.value })} error={errors.subject} />
        <Textarea label="Message body" rows={8} value={data.body || editing.body} onChange={(e) => setData({ ...data, id: editing.id, body: e.target.value })} error={errors.body} />
      </div>
    </Modal>
  );
}

/* ============ IN-APP NOTIFICATIONS ============ */
export function InAppNotificationsPage() {
  const toast = useToast();
  const [items, setItems] = useState(inAppNotifications);
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);

  const toggle = (id) => setItems((all) => all.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i)));

  const save = (data) => {
    if (form.mode === "add") {
      setItems((all) => [...all, { ...data, id: `in_${Date.now()}` }]);
      toast.success("Notification created");
    } else {
      setItems((all) => all.map((i) => (i.id === data.id ? { ...i, ...data } : i)));
      toast.success("Notification updated");
    }
    setForm(null);
  };

  return (
    <div className="space-y-4">
      <Card padded={false}>
        <div className="p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-main">In-App Notifications</h3>
            <p className="text-xs text-muted mt-0.5">Push notifications delivered inside the app</p>
          </div>
          <Button onClick={() => setForm({ mode: "add", data: { name: "", title: "", message: "", type: "Info", enabled: true } })}>
            <Plus size={14} /> New Notification
          </Button>
        </div>
        {items.length === 0 ? (
          <EmptyState icon={Bell} title="No in-app notifications" />
        ) : (
          <div className="divide-y divide-app">
            {items.map((n) => (
              <div key={n.id} className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
                  <Bell size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium text-main">{n.name}</div>
                    <Badge variant={n.type === "Info" ? "info" : n.type === "Success" ? "success" : n.type === "Warning" ? "warning" : "danger"}>{n.type}</Badge>
                    <Badge variant={n.enabled ? "success" : "muted"}>{n.enabled ? "Enabled" : "Disabled"}</Badge>
                  </div>
                  <div className="text-sm text-main mt-1">{n.title}</div>
                  <div className="text-xs text-muted mt-0.5">{n.message}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={n.enabled} onChange={() => toggle(n.id)} />
                  <button onClick={() => setPreview(n)} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Eye size={14} /></button>
                  <button onClick={() => setForm({ mode: "edit", data: { ...n } })} className="p-1.5 rounded hover:bg-app text-muted hover:text-main"><Edit2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <InAppFormModal form={form} onClose={() => setForm(null)} onSave={save} />

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Preview" size="sm">
        {preview && (
          <div className="p-4 rounded-lg border-2" style={{ borderColor: "var(--color-primary)", background: "var(--color-primary-soft)" }}>
            <div className="flex items-start gap-2">
              <Bell size={16} className="text-primary mt-1" />
              <div>
                <div className="font-semibold text-main">{preview.title}</div>
                <div className="text-sm text-muted mt-1">{preview.message.replace(/{{categoryName}}/g, "Leadership")}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function InAppFormModal({ form, onClose, onSave }) {
  const [data, setData] = useState(form?.data || {});
  const [errors, setErrors] = useState({});
  useEffect(() => { setData(form?.data || {}); setErrors({}); }, [form]);
  if (!form) return null;

  const submit = () => {
    const e = {};
    if (!data.name?.trim()) e.name = "Name required";
    if (!data.title?.trim()) e.title = "Title required";
    if (!data.message?.trim()) e.message = "Message required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(data);
  };

  return (
    <Modal
      open={!!form}
      onClose={onClose}
      title={form.mode === "add" ? "New In-App Notification" : "Edit Notification"}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={submit}>Save</Button></>}
    >
      <div className="space-y-3">
        <Input label="Internal name" value={data.name || ""} onChange={(e) => setData({ ...data, name: e.target.value })} error={errors.name} required />
        <Input label="Title (shown to user)" value={data.title || ""} onChange={(e) => setData({ ...data, title: e.target.value })} error={errors.title} required />
        <Textarea label="Message" rows={3} value={data.message || ""} onChange={(e) => setData({ ...data, message: e.target.value })} error={errors.message} required />
        <Select label="Type" value={data.type || "Info"} onChange={(e) => setData({ ...data, type: e.target.value })}>
          <option>Info</option><option>Success</option><option>Warning</option><option>Danger</option>
        </Select>
      </div>
    </Modal>
  );
}
