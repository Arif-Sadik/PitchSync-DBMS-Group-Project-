import { Activity, Bell, CalendarDays, ChartNoAxesColumn, CircleDot } from "lucide-react";
import { MetricCard } from "@/components/data-display/metric-card";
import { SectionCard } from "@/components/data-display/section-card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { PageHeader } from "@/components/page/page-header";
import { StatePanel } from "@/features/shared/state-panel";

export function PlayerDashboard() {
  return <><PageHeader eyebrow="Player workspace" title="Welcome to your dashboard" description="Review performance, availability, and schedule information." /><section className="grid grid-cols-3 gap-4"><MetricCard label="Fitness score" icon={Activity} /><MetricCard label="Selection status" value="—" helper="Not available" icon={CircleDot} /><MetricCard label="Next-match target" icon={CalendarDays} /></section><section className="grid grid-cols-[1.25fr_.75fr] gap-5"><SectionCard title="Career summary" icon={ChartNoAxesColumn}><StatePanel title="No career records found" /></SectionCard><div className="rounded-xl border bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold">Profile status</p><StatusBadge status="No data available" /></div><div className="mt-6 grid size-16 place-items-center rounded-full bg-[var(--primary-soft)]"><CircleDot className="size-7 text-[var(--primary)]" /></div><p className="mt-5 text-sm font-semibold">Player record</p><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">No player information available.</p></div></section><section className="grid grid-cols-2 gap-5"><SectionCard title="Upcoming schedule" icon={CalendarDays}><StatePanel title="No upcoming matches" /></SectionCard><SectionCard title="Notifications" icon={Bell}><StatePanel title="No notifications" /></SectionCard></section></>;
}
