import { isRoleId } from "@/config/roles";
import type { DemoSession, RoleId } from "./types";

export const DEMO_SESSION_KEY = "pitchsync-demo-session";
export const emptyDemoSession: DemoSession = { signedIn: false, role: null };
let cachedSession = emptyDemoSession;
let initialized = false;
const listeners = new Set<() => void>();

export function readDemoSession(): DemoSession {
  if (typeof window === "undefined") return emptyDemoSession;
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(DEMO_SESSION_KEY) ?? "null");
    if (!parsed || typeof parsed !== "object") return emptyDemoSession;
    const candidate = parsed as { signedIn?: unknown; role?: unknown };
    return { signedIn: candidate.signedIn === true, role: isRoleId(candidate.role) ? candidate.role : null };
  } catch { return emptyDemoSession; }
}

function publish(session: DemoSession) {
  cachedSession = session;
  listeners.forEach((listener) => listener());
}

export function getDemoSessionSnapshot() {
  if (!initialized && typeof window !== "undefined") {
    cachedSession = readDemoSession();
    initialized = true;
  }
  return cachedSession;
}

export function subscribeDemoSession(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function writeSignedInSession() {
  const session = { signedIn: true, role: null } satisfies DemoSession;
  sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  publish(session);
}

export function writeSelectedRole(role: RoleId) {
  const session = { signedIn: true, role } satisfies DemoSession;
  sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  publish(session);
}

export function clearDemoSession() { sessionStorage.removeItem(DEMO_SESSION_KEY); publish(emptyDemoSession); }
