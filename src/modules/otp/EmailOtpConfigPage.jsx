import { useState } from "react";
import { Save, Mail, ShieldCheck } from "lucide-react";
import { Card, CardHeader, Button, Input, Textarea, Alert, Badge } from "../../components/ui/index.jsx";
import { defaultOtpConfig } from "../../mock/data.js";
import { useToast } from "../../hooks/useToast.jsx";

export default function EmailOtpConfigPage() {
  const toast = useToast();
  const [cfg, setCfg] = useState(defaultOtpConfig);
  const [template, setTemplate] = useState(
    "Hi {{userName}},\n\nYour OTP for Nova Admin is {{otp}}.\nThis code expires in {{expiryMinutes}} minutes.\n\nIf you didn't request this, ignore this email.\n\n— Nova Team"
  );
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    toast.success("Configuration saved");
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (patch) => setCfg((c) => ({ ...c, ...patch }));

  return (
    <div className="space-y-4 max-w-5xl">
      {saved && <Alert variant="success">Email & OTP configuration updated.</Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="OTP Configuration" subtitle="Controls OTP generation & validation behavior" />
          <div className="space-y-3">
            <Input label="OTP expiry duration (seconds)" type="number" value={cfg.expirySeconds} onChange={(e) => set({ expirySeconds: +e.target.value })} hint={`${Math.floor(cfg.expirySeconds / 60)} minute(s)`} />
            <Input label="Resend timer (seconds)" type="number" value={cfg.resendSeconds} onChange={(e) => set({ resendSeconds: +e.target.value })} />
            <Input label="Maximum attempts before lock" type="number" value={cfg.maxAttempts} onChange={(e) => set({ maxAttempts: +e.target.value })} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Email Configuration" subtitle="Sender identity for outbound OTP emails" />
          <div className="space-y-3">
            <Input label="From address" icon={Mail} value={cfg.emailFrom} onChange={(e) => set({ emailFrom: e.target.value })} />
            <Input label="Email subject" value={cfg.emailSubject} onChange={(e) => set({ emailSubject: e.target.value })} />
            <div className="text-xs p-2 rounded-lg" style={{ background: "var(--color-bg)", color: "var(--color-text-muted)" }}>
              Email delivery is handled by an external service. Configure it in production.
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Email Template"
          subtitle="Use {{userName}}, {{otp}}, {{expiryMinutes}} placeholders"
          action={<Badge variant="info"><ShieldCheck size={12} /> Preview available</Badge>}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Textarea rows={10} value={template} onChange={(e) => setTemplate(e.target.value)} />
          <div className="border border-app rounded-lg p-4 text-sm text-main" style={{ background: "var(--color-bg)" }}>
            <div className="text-xs uppercase text-muted mb-1">Preview</div>
            <div className="font-semibold mb-2">{cfg.emailSubject}</div>
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {template
                .replace(/{{userName}}/g, "Aarav Sharma")
                .replace(/{{otp}}/g, "483920")
                .replace(/{{expiryMinutes}}/g, String(Math.floor(cfg.expirySeconds / 60)))}
            </pre>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save}><Save size={14} /> Save Configuration</Button>
      </div>
    </div>
  );
}
