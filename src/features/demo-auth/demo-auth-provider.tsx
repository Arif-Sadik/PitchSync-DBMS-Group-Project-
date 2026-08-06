"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { clearDemoSession, emptyDemoSession, getDemoSessionSnapshot, subscribeDemoSession, writeSelectedRole, writeSignedInSession } from "./demo-session";
import type { DemoSession, RoleId } from "./types";

type DemoAuthContextValue = DemoSession & {
  hydrated: boolean;
  beginDemo: () => void;
  selectRole: (role: RoleId) => void;
  signOut: () => void;
};

const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(subscribeDemoSession, getDemoSessionSnapshot, () => emptyDemoSession);
  const hydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const beginDemo = useCallback(() => { writeSignedInSession(); }, []);
  const selectRole = useCallback((role: RoleId) => { writeSelectedRole(role); }, []);
  const signOut = useCallback(() => { clearDemoSession(); }, []);
  const value = useMemo(() => ({ ...session, hydrated, beginDemo, selectRole, signOut }), [session, hydrated, beginDemo, selectRole, signOut]);
  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

export function useDemoAuth() {
  const value = useContext(DemoAuthContext);
  if (!value) throw new Error("useDemoAuth must be used within DemoAuthProvider");
  return value;
}
