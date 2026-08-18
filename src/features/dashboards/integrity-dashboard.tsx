import Link from "next/link";
import { BookOpen, BriefcaseMedical, CircleAlert, Flag, Unlink, UserSearch, UsersRound } from "lucide-react";
import { MetricCard } from "@/components/data-display/metric-card";
import { SectionCard } from "@/components/data-display/section-card";
import { UnavailableFeature } from "@/components/feedback/unavailable-feature";
import { PageHeader } from "@/components/page/page-header";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/features/shared/state-panel";

export function IntegrityDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Integrity & compliance"
        title="Integrity oversight"
        description="Manage confidential complaint and integrity case workflows."
        actions={<div className="flex gap-2"><Button asChild><Link href="/integrity/complaints">Open complaints</Link></Button><Button asChild variant="outline"><Link href="/integrity/cases/preview">View case</Link></Button></div>}
      />
      <section className="grid grid-cols-4 gap-4">
        <MetricCard label="Unlinked complaints" icon={Unlink} />
        <MetricCard label="Active cases" icon={BriefcaseMedical} />
        <MetricCard label="My investigations" icon={UserSearch} />
        <MetricCard label="Pending referrals" icon={Flag} />
      </section>
      <section className="grid grid-cols-3 gap-5">
        <SectionCard title="My Investigations" className="col-span-2">
          <StatePanel title="No investigations assigned" />
        </SectionCard>
        <SectionCard title="Cases Without Evidence" icon={CircleAlert}>
          <StatePanel title="No cases without evidence" />
        </SectionCard>
        <SectionCard title="Recent Case Activity" className="col-span-2">
          <StatePanel title="No case activity recorded" />
        </SectionCard>
        <SectionCard title="Investigator Workload" icon={UsersRound}>
          <StatePanel title="No workload information available" />
        </SectionCard>
        <SectionCard title="Rulebook Reference" className="col-span-3" icon={BookOpen}>
          <UnavailableFeature compact title="No rulebook information available" />
        </SectionCard>
      </section>
    </>
  );
}
