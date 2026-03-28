"use client";

import { createContext, useContext } from "react";
import { useSession, signOut } from "@/src/lib/auth-client";

export type UserRole = "admin" | "customer";

interface AuthContextType {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string | null;
  } | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isPending: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user.role ?? "customer") as UserRole,
        image: session.user.image,
      }
    : null;

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  async function logout() {
    await signOut();
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, isPending, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
