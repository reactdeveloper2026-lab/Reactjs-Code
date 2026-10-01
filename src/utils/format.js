export function formatDate(iso, opts = {}) {
  if (!iso) return "-";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: opts.time !== false ? "2-digit" : undefined,
    minute: opts.time !== false ? "2-digit" : undefined,
  });
}

export function formatDateShort(iso) {
  return formatDate(iso, { time: false });
}

export function formatCurrency(v, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(v);
  } catch {
    return `$${v}`;
  }
}

export function formatNumber(v) {
  return new Intl.NumberFormat().format(v);
}

export function initials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
