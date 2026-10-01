import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: "var(--color-success)",
  error: "var(--color-danger)",
  warning: "var(--color-warning)",
  info: "var(--color-info)",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => remove(id), duration);
    },
    [remove]
  );

  const api = {
    show: push,
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    warning: (m) => push(m, "warning"),
    info: (m) => push(m, "info"),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-[320px] max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className="toast-in bg-card border border-app rounded-lg shadow-lg p-3 flex items-start gap-3"
              style={{ borderLeft: `4px solid ${colors[t.type]}` }}
            >
              <Icon size={18} style={{ color: colors[t.type], flexShrink: 0, marginTop: 2 }} />
              <div className="flex-1 text-sm text-main">{t.message}</div>
              <button onClick={() => remove(t.id)} className="text-muted hover:text-main">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
