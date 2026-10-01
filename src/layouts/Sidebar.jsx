import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, X, Sparkles } from "lucide-react";
import { navigation } from "../constants/navigation.js";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import { cn } from "../utils/cn.js";

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const { hasPermission } = useAuth();
  const [openGroups, setOpenGroups] = useState(() => {
    const s = {};
    navigation.forEach((g) => (s[g.section] = true));
    return s;
  });

  const toggle = (name) => setOpenGroups((o) => ({ ...o, [name]: !o[name] }));

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: "rgba(15,23,42,.35)" }}
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "bg-sidebar flex flex-col fixed lg:sticky top-0 h-screen inset-y-0 left-0 z-50 transition-all duration-300 border-r border-app",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-app flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--color-primary)" }}
            >
              <Sparkles size={18} className="text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate text-main">Nova Admin</div>
                <div className="text-[10px] uppercase tracking-wider text-muted">Enterprise</div>
              </div>
            )}
          </div>
          <button
            className="lg:hidden text-muted hover:text-main"
            onClick={onCloseMobile}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navigation.map((group) => {
            const visibleItems = group.items.filter((i) => hasPermission(i.permission));
            if (!visibleItems.length) return null;
            const isOpen = openGroups[group.section];
            return (
              <div key={group.section}>
                {!collapsed && (
                  <button
                    onClick={() => group.collapsible && toggle(group.section)}
                    className="w-full flex items-center justify-between px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted hover:text-main transition-colors"
                  >
                    <span>{group.section}</span>
                    {group.collapsible && (
                      <ChevronDown size={12} className={cn("transition-transform", !isOpen && "-rotate-90")} />
                    )}
                  </button>
                )}
                {(collapsed || isOpen || !group.collapsible) && (
                  <div className="space-y-0.5 mt-1">
                    {visibleItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onCloseMobile}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative",
                            !isActive && "hover:bg-app",
                            collapsed && "justify-center"
                          )
                        }
                        style={({ isActive }) =>
                          isActive
                            ? {
                                background: "var(--color-sidebar-active)",
                                color: "var(--color-sidebar-active-text)",
                                fontWeight: 500,
                              }
                            : { color: "var(--color-sidebar-text)" }
                        }
                      >
                        <item.icon size={18} className="flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="p-3 border-t border-app flex-shrink-0">
            <div className="text-[10px] text-muted text-center">v1.0.0 · Nova Admin</div>
          </div>
        )}
      </aside>
    </>
  );
}
