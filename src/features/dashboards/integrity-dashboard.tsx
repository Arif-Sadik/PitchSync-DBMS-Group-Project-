import Link from "next/link";
import { BellRing, BookOpen, BriefcaseMedical, Flag, ShieldAlert, UserSearch } from "lucide-react";
import { MetricCard } from "@/components/data-display/metric-card";
import { SectionCard } from "@/components/data-display/section-card";
import { PlannedFeature } from "@/components/feedback/planned-feature";
import { PageHeader } from "@/components/page/page-header";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/features/shared/state-panel";

export function IntegrityDashboard() {
  return <><PageHeader eyebrow="Integrity & compliance" title="Integrity oversight" description="Structured, confidential frontend areas for complaints and integrity case management." actions={<div className="flex gap-2"><Button asChild><Link href="/integrity/complaints">Open complaints</Link></Button><Button asChild variant="outline"><Link href="/integrity/cases/preview">Preview case</Link></Button></div>} /><section className="grid grid-cols-4 gap-4"><MetricCard label="Open complaints" icon={ShieldAlert} /><MetricCard label="Active investigations" icon={BriefcaseMedical} /><MetricCard label="Persons of interest" icon={UserSearch} /><MetricCard label="Pending referrals" icon={Flag} /></section><section className="grid grid-cols-3 gap-5"><SectionCard title="Recent case activity" className="col-span-2"><StatePanel title="No case activity available" /></SectionCard><SectionCard title="Risk alerts" icon={BellRing}><StatePanel title="No alerts available" /></SectionCard><SectionCard title="Case status" className="col-span-2"><StatePanel title="No case status records available" /></SectionCard><SectionCard title="Rulebook reference" icon={BookOpen}><PlannedFeature compact title="Rulebook management" /></SectionCard></section></>;
}
