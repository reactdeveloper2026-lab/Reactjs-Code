import { forwardRef, useEffect, useState } from "react";
import { Loader2, X, ChevronDown, Search, Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn.js";

/* ============ BUTTON ============ */
export const Button = forwardRef(function Button(
  { as: As = "button", variant = "primary", size = "md", loading, className, children, disabled, ...rest },
  ref
) {
  const variants = {
    primary: "text-white",
    secondary: "bg-transparent border",
    ghost: "bg-transparent",
    danger: "text-white",
    outline: "bg-transparent border",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
    icon: "p-2",
  };
  const style =
    variant === "primary"
      ? { background: "var(--color-primary)" }
      : variant === "danger"
      ? { background: "var(--color-danger)" }
      : variant === "secondary"
      ? { borderColor: "var(--color-border)", color: "var(--color-text)", background: "var(--color-card)" }
      : variant === "outline"
      ? { borderColor: "var(--color-primary)", color: "var(--color-primary)" }
      : { color: "var(--color-text)" };
  return (
    <As
      ref={ref}
      disabled={disabled || loading}
      style={style}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </As>
  );
});

/* ============ CARD ============ */
export function Card({ className, children, padded = true, ...rest }) {
  return (
    <div
      className={cn("bg-card border border-app rounded-xl", padded && "p-5", className)}
      style={{ borderRadius: "var(--radius)" }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-4 gap-3">
      <div>
        <h3 className="font-semibold text-main text-base">{title}</h3>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ============ INPUT ============ */
export const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className, containerClassName, required, ...rest },
  ref
) {
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label className="text-xs font-medium text-main">
          {label} {required && <span style={{ color: "var(--color-danger)" }}>*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-card border border-app rounded-lg px-3 py-2 text-sm text-main placeholder:text-muted",
            "focus:outline-none focus:ring-2 transition-all",
            Icon && "pl-9",
            error && "border-red-500",
            className
          )}
          style={{
            borderRadius: "var(--radius)",
            "--tw-ring-color": "var(--color-primary)",
          }}
          {...rest}
        />
      </div>
      {hint && !error && <span className="text-xs text-muted">{hint}</span>}
      {error && <span className="text-xs" style={{ color: "var(--color-danger)" }}>{error}</span>}
    </div>
  );
});

/* ============ PASSWORD INPUT ============ */
export function PasswordInput({ label, error, hint, required, ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-main">
          {label} {required && <span style={{ color: "var(--color-danger)" }}>*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className={cn(
            "w-full bg-card border border-app rounded-lg px-3 py-2 pr-10 text-sm text-main placeholder:text-muted",
            "focus:outline-none focus:ring-2",
            error && "border-red-500"
          )}
          style={{ borderRadius: "var(--radius)", "--tw-ring-color": "var(--color-primary)" }}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && !error && <span className="text-xs text-muted">{hint}</span>}
      {error && <span className="text-xs" style={{ color: "var(--color-danger)" }}>{error}</span>}
    </div>
  );
}

/* ============ SELECT ============ */
export function Select({ label, error, children, required, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-main">
          {label} {required && <span style={{ color: "var(--color-danger)" }}>*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "w-full appearance-none bg-card border border-app rounded-lg px-3 py-2 pr-8 text-sm text-main",
            "focus:outline-none focus:ring-2",
            error && "border-red-500"
          )}
          style={{ borderRadius: "var(--radius)", "--tw-ring-color": "var(--color-primary)" }}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      </div>
      {error && <span className="text-xs" style={{ color: "var(--color-danger)" }}>{error}</span>}
    </div>
  );
}

/* ============ TEXTAREA ============ */
export function Textarea({ label, error, required, rows = 4, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-main">
          {label} {required && <span style={{ color: "var(--color-danger)" }}>*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "w-full bg-card border border-app rounded-lg px-3 py-2 text-sm text-main placeholder:text-muted",
          "focus:outline-none focus:ring-2 resize-vertical",
          error && "border-red-500"
        )}
        style={{ borderRadius: "var(--radius)", "--tw-ring-color": "var(--color-primary)" }}
        {...rest}
      />
      {error && <span className="text-xs" style={{ color: "var(--color-danger)" }}>{error}</span>}
    </div>
  );
}

/* ============ BADGE ============ */
export function Badge({ children, variant = "default", className }) {
  const map = {
    default: { bg: "var(--color-primary-soft)", color: "var(--color-primary)" },
    success: { bg: "rgba(22,163,74,.12)", color: "var(--color-success)" },
    warning: { bg: "rgba(245,158,11,.15)", color: "var(--color-warning)" },
    danger: { bg: "rgba(220,38,38,.12)", color: "var(--color-danger)" },
    info: { bg: "rgba(14,165,233,.12)", color: "var(--color-info)" },
    muted: { bg: "rgba(100,116,139,.12)", color: "var(--color-text-muted)" },
  };
  const s = map[variant] || map.default;
  return (
    <span
      className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", className)}
      style={{ background: s.bg, color: s.color }}
    >
      {children}
    </span>
  );
}

/* ============ MODAL ============ */
export function Modal({ open, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.45)" }}>
      <div
        className={cn("bg-card border border-app rounded-xl w-full flex flex-col max-h-[90vh]", widths[size])}
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-app">
          <h3 className="font-semibold text-main">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-main"><X size={18} /></button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
        {footer && <div className="p-4 border-t border-app flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

/* ============ CONFIRM DIALOG ============ */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", variant = "primary", loading }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-muted">{message}</p>
    </Modal>
  );
}

/* ============ EMPTY STATE ============ */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--color-primary-soft)" }}>
          <Icon size={26} className="text-primary" />
        </div>
      )}
      <h4 className="font-semibold text-main">{title}</h4>
      {description && <p className="text-sm text-muted mt-1 max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ============ SKELETON ============ */
export function Skeleton({ className, ...rest }) {
  return <div className={cn("skeleton", className)} {...rest} />;
}

/* ============ TABLE ============ */
export function Table({ columns, rows, empty, loading, keyField = "id" }) {
  if (loading) {
    return (
      <div className="p-3 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  if (!rows?.length) {
    return empty || <EmptyState title="No data available" description="There is nothing to show here yet." />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left" style={{ background: "var(--color-bg)" }}>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted whitespace-nowrap">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField]} className="border-t border-app hover:bg-[var(--color-primary-soft)]/40 transition-colors">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-main whitespace-nowrap">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============ PAGINATION ============ */
export function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between p-3 border-t border-app flex-wrap gap-3">
      <span className="text-xs text-muted">Showing {from}-{to} of {total}</span>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
        {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "min-w-[32px] h-8 px-2 rounded-md text-xs font-medium transition-colors",
                p === page ? "text-white" : "text-muted hover:bg-app"
              )}
              style={p === page ? { background: "var(--color-primary)" } : {}}
            >
              {p}
            </button>
          );
        })}
        {totalPages > 5 && <span className="text-muted text-xs px-2">…</span>}
        <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
}

/* ============ TOOLTIP ============ */
export function Tooltip({ children, content, side = "top" }) {
  return (
    <span className="relative inline-flex group">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute z-40 opacity-0 group-hover:opacity-100 transition-opacity",
          "text-xs px-2 py-1 rounded whitespace-nowrap shadow-md",
          side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-1",
          side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-1"
        )}
        style={{ background: "var(--color-secondary)", color: "#fff" }}
      >
        {content}
      </span>
    </span>
  );
}

/* ============ SEARCH BAR ============ */
export function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full max-w-xs">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-card border border-app rounded-lg pl-9 pr-3 py-2 text-sm text-main placeholder:text-muted focus:outline-none focus:ring-2"
        style={{ "--tw-ring-color": "var(--color-primary)" }}
      />
    </div>
  );
}

/* ============ SWITCH ============ */
export function Switch({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-9 h-5 rounded-full transition-colors",
          checked ? "" : "bg-gray-300"
        )}
        style={checked ? { background: "var(--color-primary)" } : {}}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
            checked && "translate-x-4"
          )}
        />
      </span>
      {label && <span className="text-sm text-main">{label}</span>}
    </label>
  );
}

/* ============ ALERT ============ */
export function Alert({ variant = "info", title, children }) {
  const map = {
    info: { bg: "rgba(14,165,233,.08)", color: "var(--color-info)" },
    success: { bg: "rgba(22,163,74,.08)", color: "var(--color-success)" },
    warning: { bg: "rgba(245,158,11,.1)", color: "var(--color-warning)" },
    danger: { bg: "rgba(220,38,38,.08)", color: "var(--color-danger)" },
  };
  const s = map[variant];
  return (
    <div className="p-3 rounded-lg text-sm border border-app" style={{ background: s.bg, borderLeft: `4px solid ${s.color}` }}>
      {title && <div className="font-semibold mb-1" style={{ color: s.color }}>{title}</div>}
      <div className="text-main">{children}</div>
    </div>
  );
}
