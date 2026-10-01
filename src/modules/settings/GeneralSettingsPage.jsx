import { useState } from "react";
import { Card, CardHeader, Button, Input, Select, Switch, Alert } from "../../components/ui/index.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { useToast } from "../../hooks/useToast.jsx";
import { timezones } from "../../mock/data.js";

export default function GeneralSettingsPage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [timezone, setTimezone] = useState(user.timezone);
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    weeklyReport: false,
  });

  const save = () => {
    updateUser({ name, email, timezone });
    toast.success("Profile updated");
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <Card>
        <CardHeader title="Profile" subtitle="Your personal admin account information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Role" value={user.role} disabled />
          <Select label="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {timezones.map((tz) => <option key={tz}>{tz}</option>)}
          </Select>
        </div>
      </Card>

      <Card>
        <CardHeader title="Notification Preferences" subtitle="Choose how you want to be notified" />
        <div className="space-y-2">
          <ToggleRow label="Email notifications" checked={notifications.email} onChange={(v) => setNotifications({ ...notifications, email: v })} />
          <ToggleRow label="In-app notifications" checked={notifications.inApp} onChange={(v) => setNotifications({ ...notifications, inApp: v })} />
          <ToggleRow label="Weekly summary report" checked={notifications.weeklyReport} onChange={(v) => setNotifications({ ...notifications, weeklyReport: v })} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Session" subtitle="Manage your active session" />
        <Alert variant="info">
          You are currently logged in as <strong>{user.name}</strong> in the {user.timezone} timezone.
        </Alert>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save}>Save Changes</Button>
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
