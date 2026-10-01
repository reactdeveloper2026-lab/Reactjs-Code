import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { Card, Button } from "../../components/ui/index.jsx";

export default function UnauthorizedPage() {
  return (
    <div className="max-w-lg mx-auto">
      <Card className="text-center py-10">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: "rgba(220,38,38,.1)" }}>
          <ShieldOff size={30} style={{ color: "var(--color-danger)" }} />
        </div>
        <h2 className="text-2xl font-bold text-main mt-4">Access Denied</h2>
        <p className="text-sm text-muted mt-2">
          You don't have permission to view this page. If you believe this is a
          mistake, please contact your administrator to request access.
        </p>
        <Button as={Link} to="/dashboard" className="mt-6">
          Return to Dashboard
        </Button>
      </Card>
    </div>
  );
}
