/**
 * Permission catalog grouped by module.
 * Used in Role Management and access-control UI.
 */
export const permissionModules = [
  {
    key: "user_management",
    label: "User Management",
    permissions: ["view", "add", "edit", "block", "unblock", "export"],
  },
  {
    key: "category",
    label: "Category & Questions",
    permissions: ["view", "add", "edit", "remove", "configure"],
  },
  {
    key: "audit_log",
    label: "Audit Log",
    permissions: ["view", "export"],
  },
  {
    key: "subscription",
    label: "Subscription",
    permissions: ["view", "manage", "configure"],
  },
  {
    key: "payment",
    label: "Payment",
    permissions: ["view", "manage", "configure"],
  },
  {
    key: "admin_users",
    label: "Admin Users",
    permissions: ["view", "add", "edit", "block", "unblock"],
  },
  {
    key: "notifications",
    label: "Notifications",
    permissions: ["view", "manage"],
  },
  {
    key: "settings",
    label: "Settings",
    permissions: ["view", "manage"],
  },
];

/** Default roles seeded from mock data */
export const defaultRoles = ["Super Admin", "Admin", "Support Admin", "Custom Role"];
