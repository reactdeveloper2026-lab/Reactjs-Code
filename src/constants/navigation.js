import {
  LayoutDashboard, Users, Shield, FolderTree, MessageSquare,
  HelpCircle, Clock, KeyRound, UserCog, CreditCard,
  Receipt, ScrollText, Bell, Settings, Palette, Lock, Mail,
} from "lucide-react";

export const navigation = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, permission: null },
    ],
  },
  {
    section: "Authentication",
    items: [
      { label: "Password Policy", to: "/password-policy", icon: Lock, permission: "settings.manage" },
      { label: "Email & OTP", to: "/email-otp", icon: Mail, permission: "settings.manage" },
    ],
  },
  {
    section: "User Management",
    collapsible: true,
    items: [
      { label: "App Users", to: "/users/app", icon: Users, permission: "user_management.view" },
      { label: "Admin Users", to: "/users/admins", icon: UserCog, permission: "admin_users.view" },
    ],
  },
  {
    section: "Category & Questions",
    collapsible: true,
    items: [
      { label: "Categories", to: "/categories", icon: FolderTree, permission: "category.view" },
      { label: "Generation Messages", to: "/categories/messages", icon: MessageSquare, permission: "category.configure" },
      { label: "Reflection Questions", to: "/categories/reflection", icon: HelpCircle, permission: "category.configure" },
      { label: "Scenario Retention", to: "/categories/retention", icon: Clock, permission: "category.configure" },
    ],
  },
  {
    section: "Role Management",
    collapsible: true,
    items: [
      { label: "Roles", to: "/roles", icon: Shield, permission: "admin_users.view" },
      { label: "Permissions", to: "/roles/permissions", icon: KeyRound, permission: "admin_users.view" },
    ],
  },
  {
    section: "Subscription",
    collapsible: true,
    items: [
      { label: "Subscription Plans", to: "/subscriptions/plans", icon: CreditCard, permission: "subscription.view" },
      { label: "Subscription Settings", to: "/subscriptions/settings", icon: Settings, permission: "subscription.configure" },
    ],
  },
  {
    section: "Payment",
    collapsible: true,
    items: [
      { label: "Transactions", to: "/payments/transactions", icon: Receipt, permission: "payment.view" },
      { label: "Payment Settings", to: "/payments/settings", icon: Settings, permission: "payment.configure" },
    ],
  },
  {
    section: "Audit Log",
    items: [
      { label: "Audit Log", to: "/audit-log", icon: ScrollText, permission: "audit_log.view" },
    ],
  },
  {
    section: "Notifications",
    collapsible: true,
    items: [
      { label: "Email Notifications", to: "/notifications/email", icon: Mail, permission: "notifications.view" },
      { label: "In-App Notifications", to: "/notifications/in-app", icon: Bell, permission: "notifications.view" },
    ],
  },
  {
    section: "Settings",
    collapsible: true,
    items: [
      { label: "Theme / Appearance", to: "/settings/theme", icon: Palette, permission: null },
      { label: "General Settings", to: "/settings/general", icon: Settings, permission: null },
    ],
  },
];
