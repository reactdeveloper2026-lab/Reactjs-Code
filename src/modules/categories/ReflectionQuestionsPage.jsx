import { useState } from "react";
import { Save, X, Edit2 } from "lucide-react";
import { Card, CardHeader, Button, Textarea, Switch, Badge } from "../../components/ui/index.jsx";
import { reflectionQuestion } from "../../mock/data.js";
import { formatDate } from "../../utils/format.js";
import { useToast } from "../../hooks/useToast.jsx";

export default function ReflectionQuestionsPage() {
  const toast = useToast();
  const [rq, setRq] = useState(reflectionQuestion);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(rq);
  const [error, setError] = useState(null);

  const startEdit = () => { setDraft(rq); setEditing(true); setError(null); };
  const cancel = () => { setDraft(rq); setEditing(false); setError(null); };
  const save = () => {
    if (!draft.text?.trim()) return setError("Question text cannot be empty.");
    if (draft.text.length < 10) return setError("Question is too short.");
    setRq({ ...draft, updatedAt: new Date().toISOString() });
    setEditing(false);
    toast.success("Reflection question updated");
  };

  return (
    <div className="max-w-3xl space-y-4">
      <Card>
        <CardHeader
          title={rq.label}
          subtitle={`Last updated ${formatDate(rq.updatedAt)}`}
          action={
            <div className="flex items-center gap-2">
              <Switch checked={rq.enabled} onChange={(v) => { setRq({ ...rq, enabled: v }); toast.info(v ? "Enabled" : "Disabled"); }} />
              <Badge variant={rq.enabled ? "success" : "muted"}>{rq.enabled ? "Enabled" : "Disabled"}</Badge>
            </div>
          }
        />

        {editing ? (
          <>
            <Textarea
              label="Question text"
              rows={4}
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              error={error}
              required
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={cancel}><X size={14} /> Cancel</Button>
              <Button onClick={save}><Save size={14} /> Save</Button>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-lg border border-app text-main text-sm leading-relaxed" style={{ background: "var(--color-bg)" }}>
              {rq.text}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="secondary" onClick={startEdit}><Edit2 size={14} /> Edit Question</Button>
            </div>
          </>
        )}
      </Card>

      <Card>
        <CardHeader title="How it's used" subtitle="This question is presented to app users after scenario completion." />
        <ul className="list-disc list-inside text-sm text-muted space-y-1">
          <li>Shown as part of the reflection flow at the end of every scenario.</li>
          <li>Disabling it will remove the question from the flow but preserve historical data.</li>
          <li>Text supports plain sentences — placeholders are not required.</li>
        </ul>
      </Card>
    </div>
  );
}
