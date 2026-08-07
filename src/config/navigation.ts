import type { LucideIcon } from "lucide-react";
import { Activity, Bell, BookOpen, BriefcaseMedical, CalendarDays, ChartNoAxesColumn, ClipboardCheck, Dumbbell, FileBarChart, FileCheck, Gauge, ListChecks, LockKeyhole, Medal, Settings, ShieldAlert, Trophy, UserRound, Users, UsersRound } from "lucide-react";
import type { RoleId } from "@/features/demo-auth/types";

export type NavigationItem = { label: string; href?: string; icon: LucideIcon; disabled?: boolean };

export const navigationByRole: Record<RoleId, readonly NavigationItem[]> = {
  "super-admin": [
    { label: "Dashboard", href: "/super-admin/dashboard", icon: Gauge }, { label: "Players", href: "/players", icon: UserRound }, { label: "Teams", href: "/teams", icon: UsersRound }, { label: "Complaints", href: "/integrity/complaints", icon: ShieldAlert },
    { label: "Users", icon: Users, disabled: true }, { label: "Roles & Permissions", icon: LockKeyhole, disabled: true }, { label: "System Logs", icon: ListChecks, disabled: true }, { label: "Reports", icon: FileBarChart, disabled: true }, { label: "Settings", icon: Settings, disabled: true },
  ],
  "board-admin": [
    { label: "Dashboard", href: "/board-admin/dashboard", icon: Gauge }, { label: "Players", href: "/players", icon: UserRound }, { label: "Teams", href: "/teams", icon: UsersRound }, { label: "Tournaments", href: "/tournaments", icon: Trophy }, { label: "Match Details", href: "/matches/preview", icon: Medal },
    { label: "Fixtures", icon: CalendarDays, disabled: true }, { label: "Career Records", icon: ChartNoAxesColumn, disabled: true }, { label: "Reports", icon: FileBarChart, disabled: true }, { label: "Settings", icon: Settings, disabled: true },
  ],
  "performance-manager": [
    { label: "Dashboard", href: "/performance/dashboard", icon: Gauge }, { label: "Players", href: "/players", icon: UserRound }, { label: "Teams", href: "/teams", icon: UsersRound }, { label: "Player Profile", href: "/players/preview", icon: FileCheck },
    { label: "Fitness", icon: Activity, disabled: true }, { label: "Injury Reports", icon: BriefcaseMedical, disabled: true }, { label: "Training", icon: Dumbbell, disabled: true }, { label: "Selection", icon: ClipboardCheck, disabled: true }, { label: "Career Statistics", icon: ChartNoAxesColumn, disabled: true }, { label: "Reports", icon: FileBarChart, disabled: true },
  ],
  "match-official": [
    { label: "Dashboard", href: "/match-official/dashboard", icon: Gauge }, { label: "Match Details", href: "/matches/preview", icon: Medal },
    { label: "Today’s Fixtures", icon: CalendarDays, disabled: true }, { label: "Upcoming Matches", icon: Trophy, disabled: true }, { label: "Match Summaries", icon: FileCheck, disabled: true }, { label: "Results", icon: ListChecks, disabled: true }, { label: "Reports", icon: FileBarChart, disabled: true },
  ],
  "integrity-officer": [
    { label: "Dashboard", href: "/integrity/dashboard", icon: Gauge }, { label: "Complaints", href: "/integrity/complaints", icon: ShieldAlert }, { label: "Integrity Case", href: "/integrity/cases/preview", icon: BriefcaseMedical },
    { label: "Persons of Interest", icon: Users, disabled: true }, { label: "Rulebook", icon: BookOpen, disabled: true }, { label: "Reports", icon: FileBarChart, disabled: true },
  ],
  player: [
    { label: "Dashboard", href: "/player/dashboard", icon: Gauge }, { label: "Player Profile", href: "/players/preview", icon: UserRound },
    { label: "Career Stats", icon: ChartNoAxesColumn, disabled: true }, { label: "Fitness", icon: Activity, disabled: true }, { label: "Availability", icon: ClipboardCheck, disabled: true }, { label: "Matches", icon: Trophy, disabled: true }, { label: "Notifications", icon: Bell, disabled: true },
  ],
};

export const routeLabels: Record<string, string> = {
  "super-admin": "Super Administrator", "board-admin": "Board Administration", performance: "Performance", "match-official": "Match Official", integrity: "Integrity", player: "Player", dashboard: "Dashboard", players: "Players", new: "Register Player", preview: "Record", teams: "Teams", tournaments: "Tournaments", matches: "Matches", complaints: "Complaints", cases: "Cases",
};
