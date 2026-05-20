"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, AuthUser } from "@/apis";

function isMembershipActive(user: AuthUser | null): boolean {
  if (!user?.membershipExpiresAt) return false;
  return new Date(user.membershipExpiresAt) > new Date();
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  membershipActive: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function refreshUser() {
    try {
      const u = await authApi.me();
      setUser(u);
    } catch {
      // keep existing user
    }
  }

  async function logout() {
    await authApi.logout().catch(() => { });
    setUser(null);
  }

  const membershipActive = isMembershipActive(user);

  return (
    <AuthContext.Provider value={{ user, loading, membershipActive, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
