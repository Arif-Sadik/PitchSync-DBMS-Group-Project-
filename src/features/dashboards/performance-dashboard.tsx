import { Activity, ClipboardCheck, Dumbbell, HeartPulse, Stethoscope } from "lucide-react";
import { MetricCard } from "@/components/data-display/metric-card";
import { SectionCard } from "@/components/data-display/section-card";
import { BackendUnavailable } from "@/components/feedback/backend-unavailable";
import { PageHeader } from "@/components/page/page-header";
import { StatePanel } from "@/features/shared/state-panel";

export function PerformanceDashboard() {
  return <><PageHeader eyebrow="Team performance" title="Readiness overview" description="A backend-ready frontend shell for fitness, availability, training, and selection workflows." /><section className="grid grid-cols-4 gap-4"><MetricCard label="Available players" icon={Activity} /><MetricCard label="Fitness average" icon={HeartPulse} /><MetricCard label="Current injuries" icon={Stethoscope} /><MetricCard label="Training sessions" icon={Dumbbell} /></section><section className="grid grid-cols-2 gap-5"><SectionCard title="Fitness distribution" description="No percentages are shown without verified records." icon={Activity}><StatePanel title="No fitness data available" /></SectionCard><SectionCard title="Current injuries" description="Sensitive medical records require backend integration." icon={Stethoscope}><StatePanel title="No injury records available" /></SectionCard><SectionCard title="Training sessions" icon={Dumbbell}><StatePanel title="No training records available" /></SectionCard><SectionCard title="Selection readiness" icon={ClipboardCheck}><BackendUnavailable compact description="Selection readiness cannot be calculated until the database service is connected." /></SectionCard></section></>;
}
