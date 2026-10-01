import { Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-app">
      {/* Left brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{
          background: "var(--color-card)",
          borderRight: "1px solid var(--color-border)",
          color: "var(--color-text)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{ background: "var(--color-primary)" }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div className="font-semibold text-main">Nova Admin</div>
            <div className="text-xs text-muted">Enterprise dashboard</div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight max-w-md text-main">
            Manage your entire platform with confidence.
          </h2>
          <p className="mt-4 text-muted max-w-md">
            Users, categories, subscriptions, payments and audit trails — all in
            one clean, enterprise-grade console.
          </p>
        </div>

        <div className="text-xs text-muted">© {new Date().getFullYear()} Nova. All rights reserved.</div>
      </div>

      {/* Right content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
