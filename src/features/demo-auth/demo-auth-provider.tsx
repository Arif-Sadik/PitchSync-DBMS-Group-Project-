"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { clearDemoSession, emptyDemoSession, getDemoSessionSnapshot, subscribeDemoSession, writeSelectedRole } from "./demo-session";
import type { DemoSession, RoleId } from "./types";

type DemoAuthContextValue = DemoSession & {
  hydrated: boolean;
  signIn: (role: RoleId) => void;
  signOut: () => void;
};

const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(subscribeDemoSession, getDemoSessionSnapshot, () => emptyDemoSession);
  const hydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const signIn = useCallback((role: RoleId) => { writeSelectedRole(role); }, []);
  const signOut = useCallback(() => { clearDemoSession(); }, []);
  const value = useMemo(() => ({ ...session, hydrated, signIn, signOut }), [session, hydrated, signIn, signOut]);
  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

export function useDemoAuth() {
  const value = useContext(DemoAuthContext);
  if (!value) throw new Error("useDemoAuth must be used within DemoAuthProvider");
  return value;
}
