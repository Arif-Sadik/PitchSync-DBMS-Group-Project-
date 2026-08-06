import type { LucideIcon } from "lucide-react";
import { BadgeCheck, ClipboardCheck, ShieldCheck, Swords, UserRound, UsersRound } from "lucide-react";
import type { RoleId } from "@/features/demo-auth/types";

export type RoleDefinition = {
  id: RoleId;
  label: string;
  shortLabel: string;
  description: string;
  dashboardRoute: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  icon: LucideIcon;
};

export const roles: readonly RoleDefinition[] = [
  { id: "super-admin", label: "Super Administrator", shortLabel: "System Administration", description: "Oversee platform access, core records, and administrative readiness.", dashboardRoute: "/super-admin/dashboard", accent: "#147A50", accentHover: "#106640", accentSoft: "#E8F4ED", icon: ShieldCheck },
  { id: "board-admin", label: "Cricket Board Administrator", shortLabel: "Board Operations", description: "Coordinate player, team, tournament, and competition administration.", dashboardRoute: "/board-admin/dashboard", accent: "#176C59", accentHover: "#115847", accentSoft: "#E6F3EF", icon: BadgeCheck },
  { id: "performance-manager", label: "Team Performance Manager", shortLabel: "Team Performance", description: "Review readiness, fitness, training, and selection information.", dashboardRoute: "/performance/dashboard", accent: "#4D7450", accentHover: "#3C603F", accentSoft: "#EBF2E9", icon: UsersRound },
  { id: "match-official", label: "Match Official", shortLabel: "Match Operations", description: "Access assignments and structured match administration screens.", dashboardRoute: "/match-official/dashboard", accent: "#2F6D77", accentHover: "#245963", accentSoft: "#E8F1F3", icon: Swords },
  { id: "integrity-officer", label: "Integrity & Compliance Officer", shortLabel: "Integrity & Compliance", description: "Manage complaint intake and integrity case workflows.", dashboardRoute: "/integrity/dashboard", accent: "#816D2B", accentHover: "#6A5921", accentSoft: "#F5F0E0", icon: ClipboardCheck },
  { id: "player", label: "Player", shortLabel: "Player Workspace", description: "View personal performance, availability, and schedule areas.", dashboardRoute: "/player/dashboard", accent: "#386B65", accentHover: "#2C5853", accentSoft: "#E8F1EF", icon: UserRound },
] as const;

export const roleIds = roles.map((role) => role.id);

export function getRole(roleId: RoleId | null | undefined) {
  return roles.find((role) => role.id === roleId);
}

export function isRoleId(value: unknown): value is RoleId {
  return typeof value === "string" && roleIds.includes(value as RoleId);
}
