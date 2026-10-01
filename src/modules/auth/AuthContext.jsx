import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: "adm_001",
  name: "Aarav Sharma",
  email: "aarav.sharma@nova.com",
  role: "Super Admin",
  avatar: null,
  timezone: "Asia/Kolkata",
  // Full permission set for demo; real values come from backend later.
  permissions: ["*"],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const api = useMemo(
    () => ({
      user,
      isAuthenticated,
      login: (u) => {
        setUser(u || DEFAULT_USER);
        setIsAuthenticated(true);
      },
      logout: () => {
        setIsAuthenticated(false);
      },
      hasPermission: (perm) => {
        if (!perm) return true;
        if (!user) return false;
        if (user.permissions.includes("*")) return true;
        return user.permissions.includes(perm);
      },
      updateUser: (patch) => setUser((u) => ({ ...u, ...patch })),
    }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
