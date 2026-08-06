import type { LucideIcon } from "lucide-react";
import { Activity, Bell, BookOpen, BriefcaseMedical, CalendarDays, ChartNoAxesColumn, ClipboardCheck, Dumbbell, FileBarChart, FileCheck, Gauge, ListChecks, LockKeyhole, Medal, Settings, ShieldAlert, Trophy, UserRound, Users, UsersRound } from "lucide-react";
import type { RoleId } from "@/features/demo-auth/types";

export type NavigationItem = { label: string; href?: string; icon: LucideIcon; planned?: boolean };

export const navigationByRole: Record<RoleId, readonly NavigationItem[]> = {
  "super-admin": [
    { label: "Dashboard", href: "/super-admin/dashboard", icon: Gauge }, { label: "Players", href: "/players", icon: UserRound }, { label: "Teams", href: "/teams", icon: UsersRound }, { label: "Complaints", href: "/integrity/complaints", icon: ShieldAlert },
    { label: "Users", icon: Users, planned: true }, { label: "Roles & Permissions", icon: LockKeyhole, planned: true }, { label: "System Logs", icon: ListChecks, planned: true }, { label: "Reports", icon: FileBarChart, planned: true }, { label: "Settings", icon: Settings, planned: true },
  ],
  "board-admin": [
    { label: "Dashboard", href: "/board-admin/dashboard", icon: Gauge }, { label: "Players", href: "/players", icon: UserRound }, { label: "Teams", href: "/teams", icon: UsersRound }, { label: "Tournaments", href: "/tournaments", icon: Trophy }, { label: "Match Preview", href: "/matches/preview", icon: Medal },
    { label: "Fixtures", icon: CalendarDays, planned: true }, { label: "Career Records", icon: ChartNoAxesColumn, planned: true }, { label: "Reports", icon: FileBarChart, planned: true }, { label: "Settings", icon: Settings, planned: true },
  ],
  "performance-manager": [
    { label: "Dashboard", href: "/performance/dashboard", icon: Gauge }, { label: "Players", href: "/players", icon: UserRound }, { label: "Teams", href: "/teams", icon: UsersRound }, { label: "Profile Preview", href: "/players/preview", icon: FileCheck },
    { label: "Fitness", icon: Activity, planned: true }, { label: "Injury Reports", icon: BriefcaseMedical, planned: true }, { label: "Training", icon: Dumbbell, planned: true }, { label: "Selection", icon: ClipboardCheck, planned: true }, { label: "Career Statistics", icon: ChartNoAxesColumn, planned: true }, { label: "Reports", icon: FileBarChart, planned: true },
  ],
  "match-official": [
    { label: "Dashboard", href: "/match-official/dashboard", icon: Gauge }, { label: "Match Preview", href: "/matches/preview", icon: Medal },
    { label: "Today’s Fixtures", icon: CalendarDays, planned: true }, { label: "Upcoming Matches", icon: Trophy, planned: true }, { label: "Match Summaries", icon: FileCheck, planned: true }, { label: "Results", icon: ListChecks, planned: true }, { label: "Reports", icon: FileBarChart, planned: true },
  ],
  "integrity-officer": [
    { label: "Dashboard", href: "/integrity/dashboard", icon: Gauge }, { label: "Complaints", href: "/integrity/complaints", icon: ShieldAlert }, { label: "Case Preview", href: "/integrity/cases/preview", icon: BriefcaseMedical },
    { label: "Persons of Interest", icon: Users, planned: true }, { label: "Rulebook", icon: BookOpen, planned: true }, { label: "Reports", icon: FileBarChart, planned: true },
  ],
  player: [
    { label: "Dashboard", href: "/player/dashboard", icon: Gauge }, { label: "Profile Preview", href: "/players/preview", icon: UserRound },
    { label: "Career Stats", icon: ChartNoAxesColumn, planned: true }, { label: "Fitness", icon: Activity, planned: true }, { label: "Availability", icon: ClipboardCheck, planned: true }, { label: "Matches", icon: Trophy, planned: true }, { label: "Notifications", icon: Bell, planned: true },
  ],
};

export const routeLabels: Record<string, string> = {
  "super-admin": "Super Administrator", "board-admin": "Board Administration", performance: "Performance", "match-official": "Match Official", integrity: "Integrity", player: "Player", dashboard: "Dashboard", players: "Players", new: "Register Player", preview: "Preview", teams: "Teams", tournaments: "Tournaments", matches: "Matches", complaints: "Complaints", cases: "Cases",
};
