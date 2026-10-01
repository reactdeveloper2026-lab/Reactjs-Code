import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

import { LoginPage, OtpPage, AccountLockedPage, FirstLoginPage, ForgotPasswordPage } from "../modules/auth/AuthPages.jsx";
import DashboardPage from "../modules/dashboard/DashboardPage.jsx";
import AppUsersPage from "../modules/users/AppUsersPage.jsx";
import AdminUsersPage from "../modules/admins/AdminUsersPage.jsx";
import CategoriesPage from "../modules/categories/CategoriesPage.jsx";
import GenerationMessagesPage from "../modules/categories/GenerationMessagesPage.jsx";
import ReflectionQuestionsPage from "../modules/categories/ReflectionQuestionsPage.jsx";
import ScenarioRetentionPage from "../modules/categories/ScenarioRetentionPage.jsx";
import AuditLogPage from "../modules/auditLogs/AuditLogPage.jsx";
import { RolesPage, CreateRolePage, PermissionsPage } from "../modules/roles/RolesPages.jsx";
import PasswordPolicyPage from "../modules/passwordPolicy/PasswordPolicyPage.jsx";
import EmailOtpConfigPage from "../modules/otp/EmailOtpConfigPage.jsx";
import { SubscriptionPlansPage, SubscriptionSettingsPage } from "../modules/subscriptions/SubscriptionPages.jsx";
import { TransactionsPage, PaymentSettingsPage } from "../modules/payments/PaymentPages.jsx";
import { EmailNotificationsPage, InAppNotificationsPage } from "../modules/notifications/NotificationPages.jsx";
import ThemePage from "../modules/settings/ThemePage.jsx";
import GeneralSettingsPage from "../modules/settings/GeneralSettingsPage.jsx";
import UnauthorizedPage from "../modules/settings/UnauthorizedPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/account-locked" element={<AccountLockedPage />} />
        <Route path="/first-login" element={<FirstLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Admin */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/users/app" element={<AppUsersPage />} />
        <Route path="/users/admins" element={<AdminUsersPage />} />

        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/messages" element={<GenerationMessagesPage />} />
        <Route path="/categories/reflection" element={<ReflectionQuestionsPage />} />
        <Route path="/categories/retention" element={<ScenarioRetentionPage />} />

        <Route path="/roles" element={<RolesPage />} />
        <Route path="/roles/new" element={<CreateRolePage />} />
        <Route path="/roles/permissions" element={<PermissionsPage />} />

        <Route path="/audit-log" element={<AuditLogPage />} />
        <Route path="/password-policy" element={<PasswordPolicyPage />} />
        <Route path="/email-otp" element={<EmailOtpConfigPage />} />

        <Route path="/subscriptions/plans" element={<SubscriptionPlansPage />} />
        <Route path="/subscriptions/settings" element={<SubscriptionSettingsPage />} />

        <Route path="/payments/transactions" element={<TransactionsPage />} />
        <Route path="/payments/settings" element={<PaymentSettingsPage />} />

        <Route path="/notifications/email" element={<EmailNotificationsPage />} />
        <Route path="/notifications/in-app" element={<InAppNotificationsPage />} />

        <Route path="/settings/theme" element={<ThemePage />} />
        <Route path="/settings/general" element={<GeneralSettingsPage />} />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
