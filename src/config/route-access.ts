import type { RoleId } from "@/features/demo-auth/types";

const sharedManagementRoles: readonly RoleId[] = ["super-admin", "board-admin", "performance-manager"];

export const routeAccess: Readonly<Record<string, readonly RoleId[]>> = {
  "/super-admin/dashboard": ["super-admin"],
  "/board-admin/dashboard": ["board-admin"],
  "/performance/dashboard": ["performance-manager"],
  "/match-official/dashboard": ["match-official"],
  "/integrity/dashboard": ["integrity-officer"],
  "/player/dashboard": ["player"],
  "/players": [...sharedManagementRoles],
  "/players/new": ["super-admin", "board-admin"],
  "/players/[playerId]": [...sharedManagementRoles, "player"],
  "/teams": [...sharedManagementRoles],
  "/tournaments": ["board-admin"],
  "/matches/[matchId]": ["board-admin", "match-official"],
  "/integrity/complaints": ["super-admin", "integrity-officer"],
  "/integrity/cases/[caseId]": ["integrity-officer"],
};

export function canAccessRoute(role: RoleId, pathname: string) {
  const normalized = routeAccess[pathname] ? pathname : pathname
    .replace(/^\/players\/[^/]+$/, "/players/[playerId]")
    .replace(/^\/matches\/[^/]+$/, "/matches/[matchId]")
    .replace(/^\/integrity\/cases\/[^/]+$/, "/integrity/cases/[caseId]");
  const permitted = routeAccess[normalized];
  return !permitted || permitted.includes(role);
}
