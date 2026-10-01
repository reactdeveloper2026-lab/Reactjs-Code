import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, Bell, Sun, Moon, Search, LogOut, User, Settings, ChevronRight } from "lucide-react";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import { useTheme } from "../theme/ThemeProvider.jsx";
import { initials } from "../utils/format.js";
import { cn } from "../utils/cn.js";

const routeTitles = {
  "/dashboard": "Dashboard",
  "/users/app": "App Users",
  "/users/admins": "Admin Users",
  "/categories": "Categories",
  "/categories/messages": "Generation Messages",
  "/categories/reflection": "Reflection Questions",
  "/categories/retention": "Scenario Retention",
  "/roles": "Roles",
  "/roles/new": "Create Role",
  "/roles/permissions": "Permissions",
  "/subscriptions/plans": "Subscription Plans",
  "/subscriptions/settings": "Subscription Settings",
  "/payments/transactions": "Transactions",
  "/payments/settings": "Payment Settings",
  "/audit-log": "Audit Log",
  "/notifications/email": "Email Notifications",
  "/notifications/in-app": "In-App Notifications",
  "/settings/theme": "Theme & Appearance",
  "/settings/general": "General Settings",
  "/password-policy": "Password Policy",
  "/email-otp": "Email & OTP Configuration",
  "/unauthorized": "Access Denied",
};

function useOnClickOutside(handler) {
  const ref = useRef(null);
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [handler]);
  return ref;
}

const mockNotifications = [
  { id: 1, title: "New user signed up", time: "2m ago", type: "info" },
  { id: 2, title: "Payment received: $12.99", time: "18m ago", type: "success" },
  { id: 3, title: "3 failed login attempts detected", time: "1h ago", type: "warning" },
  { id: 4, title: "Category 'Leadership' updated", time: "3h ago", type: "info" },
];

export default function Header({ onToggleSidebar, onToggleMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleMode } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const notifRef = useOnClickOutside(() => setNotifOpen(false));
  const userRef = useOnClickOutside(() => setUserOpen(false));

  const title = routeTitles[location.pathname] || "Nova Admin";
  const crumbs = location.pathname.split("/").filter(Boolean);

  return (
    <header
      className="bg-header sticky top-0 z-30 border-b border-app"
      style={{ background: "var(--color-header)" }}
    >
      <div className="h-16 px-4 lg:px-6 flex items-center gap-3">
        {/* Single sidebar toggle — behaves differently on mobile vs desktop */}
        <button
          className="p-2 rounded-lg hover:bg-app text-muted hover:text-main"
          onClick={() => {
            if (window.innerWidth < 1024) onToggleMobile();
            else onToggleSidebar();
          }}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Title / breadcrumbs */}
        <div className="min-w-0 hidden md:block">
          <div className="text-[11px] flex items-center gap-1 text-muted">
            <Link to="/dashboard" className="hover:text-main">Home</Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight size={12} />
                <span className={cn(i === crumbs.length - 1 && "text-main font-medium")}>
                  {c.replace(/-/g, " ").replace(/^\w/, (m) => m.toUpperCase())}
                </span>
              </span>
            ))}
          </div>
          <h1 className="text-base font-semibold text-main truncate">{title}</h1>
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative hidden md:block w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            placeholder="Search anything..."
            className="w-full bg-app border border-app rounded-lg pl-9 pr-3 py-2 text-sm text-main placeholder:text-muted focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": "var(--color-primary)", background: "var(--color-bg)" }}
          />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleMode}
          title="Toggle theme"
          className="p-2 rounded-lg hover:bg-app text-muted hover:text-main"
        >
          {theme.mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="p-2 rounded-lg hover:bg-app text-muted hover:text-main relative"
          >
            <Bell size={18} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: "var(--color-danger)" }}
            />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-app rounded-xl shadow-lg overflow-hidden">
              <div className="p-3 border-b border-app flex items-center justify-between">
                <div className="font-semibold text-main">Notifications</div>
                <button className="text-xs text-primary hover:underline">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-3 border-b border-app hover:bg-app cursor-pointer">
                    <div className="text-sm text-main">{n.title}</div>
                    <div className="text-xs text-muted mt-0.5">{n.time}</div>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center">
                <button className="text-xs text-primary hover:underline">View all</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserOpen((o) => !o)}
            className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-app"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ background: "var(--color-primary)" }}
            >
              {initials(user.name)}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-main leading-tight">{user.name}</div>
              <div className="text-[10px] text-muted">{user.role}</div>
            </div>
          </button>
          {userOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-app rounded-xl shadow-lg overflow-hidden">
              <div className="p-3 border-b border-app">
                <div className="text-sm font-semibold text-main">{user.name}</div>
                <div className="text-xs text-muted truncate">{user.email}</div>
              </div>
              <div className="p-1">
                <button
                  onClick={() => { setUserOpen(false); navigate("/settings/general"); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-app text-sm text-main"
                >
                  <User size={14} /> My Profile
                </button>
                <button
                  onClick={() => { setUserOpen(false); navigate("/settings/theme"); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-app text-sm text-main"
                >
                  <Settings size={14} /> Preferences
                </button>
                <button
                  onClick={() => { logout(); navigate("/login"); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-app text-sm"
                  style={{ color: "var(--color-danger)" }}
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
