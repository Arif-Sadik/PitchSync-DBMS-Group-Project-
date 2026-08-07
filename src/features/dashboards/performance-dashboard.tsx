import { Activity, ClipboardCheck, Dumbbell, HeartPulse, Stethoscope } from "lucide-react";
import { MetricCard } from "@/components/data-display/metric-card";
import { SectionCard } from "@/components/data-display/section-card";
import { InformationUnavailable } from "@/components/feedback/information-unavailable";
import { PageHeader } from "@/components/page/page-header";
import { StatePanel } from "@/features/shared/state-panel";

export function PerformanceDashboard() {
  return <><PageHeader eyebrow="Team performance" title="Readiness overview" description="Review fitness, availability, training, and selection readiness." /><section className="grid grid-cols-4 gap-4"><MetricCard label="Available players" icon={Activity} /><MetricCard label="Fitness average" icon={HeartPulse} /><MetricCard label="Current injuries" icon={Stethoscope} /><MetricCard label="Training sessions" icon={Dumbbell} /></section><section className="grid grid-cols-2 gap-5"><SectionCard title="Fitness distribution" description="Verified fitness information." icon={Activity}><StatePanel title="No fitness information available" /></SectionCard><SectionCard title="Current injuries" description="Review current injury records." icon={Stethoscope}><StatePanel title="No injury records found" /></SectionCard><SectionCard title="Training sessions" icon={Dumbbell}><StatePanel title="No training sessions found" /></SectionCard><SectionCard title="Selection readiness" icon={ClipboardCheck}><InformationUnavailable compact title="No selection information available" /></SectionCard></section></>;
}
