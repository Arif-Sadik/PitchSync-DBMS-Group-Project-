import Link from "next/link";
import { BellRing, BookOpen, BriefcaseMedical, Flag, ShieldAlert, UserSearch } from "lucide-react";
import { MetricCard } from "@/components/data-display/metric-card";
import { SectionCard } from "@/components/data-display/section-card";
import { UnavailableFeature } from "@/components/feedback/unavailable-feature";
import { PageHeader } from "@/components/page/page-header";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/features/shared/state-panel";

export function IntegrityDashboard() {
  return <><PageHeader eyebrow="Integrity & compliance" title="Integrity oversight" description="Manage confidential complaint and integrity case workflows." actions={<div className="flex gap-2"><Button asChild><Link href="/integrity/complaints">Open complaints</Link></Button><Button asChild variant="outline"><Link href="/integrity/cases/preview">View case</Link></Button></div>} /><section className="grid grid-cols-4 gap-4"><MetricCard label="Open complaints" icon={ShieldAlert} /><MetricCard label="Active investigations" icon={BriefcaseMedical} /><MetricCard label="Persons of interest" icon={UserSearch} /><MetricCard label="Pending referrals" icon={Flag} /></section><section className="grid grid-cols-3 gap-5"><SectionCard title="Recent case activity" className="col-span-2"><StatePanel title="No case activity recorded" /></SectionCard><SectionCard title="Risk alerts" icon={BellRing}><StatePanel title="No alerts available" /></SectionCard><SectionCard title="Case status" className="col-span-2"><StatePanel title="No case status information available" /></SectionCard><SectionCard title="Rulebook reference" icon={BookOpen}><UnavailableFeature compact title="No rulebook information available" /></SectionCard></section></>;
}
