"use client";

import { Activity, CircleUserRound, FileText, Medal, UserRound } from "lucide-react";
import { DetailField } from "@/components/data-display/detail-field";
import { DetailGrid } from "@/components/data-display/detail-grid";
import { SectionCard } from "@/components/data-display/section-card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { InformationUnavailable } from "@/components/feedback/information-unavailable";
import { UnavailableFeature } from "@/components/feedback/unavailable-feature";
import { TabNavigation } from "@/components/navigation/tab-navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const tabs = [{ value: "overview", label: "Overview" }, { value: "career", label: "Career Records" }, { value: "fitness", label: "Fitness & Availability" }, { value: "documents", label: "Documents" }, { value: "activity", label: "Activity Log" }] as const;

const PersonalInformation = () => <DetailGrid><DetailField label="Full name" /><DetailField label="Date of birth" /><DetailField label="Nationality" /><DetailField label="National ID" /><DetailField label="Contact email" /><DetailField label="Phone" /></DetailGrid>;
const PlayingInformation = () => <DetailGrid><DetailField label="Primary role" /><DetailField label="Batting style" /><DetailField label="Bowling style" /><DetailField label="Preferred position" /><DetailField label="Jersey number" /><DetailField label="Contract tier" /></DetailGrid>;

export function PlayerProfile() {
  return <><header className="rounded-xl border bg-white p-6"><div className="flex items-center gap-5"><div className="grid size-20 place-items-center rounded-full border border-dashed bg-[var(--surface-muted)]"><CircleUserRound className="size-9 text-[var(--bd-green)]" /></div><div className="flex-1"><div className="flex items-center gap-3"><h1 className="heading-font text-3xl font-semibold">Player record</h1><StatusBadge status="No data available" /></div><div className="mt-4 flex gap-8 text-sm"><p><span className="text-[var(--text-muted)]">Registry ID:</span> <strong>—</strong></p><p><span className="text-[var(--text-muted)]">Team:</span> <strong>—</strong></p><p><span className="text-[var(--text-muted)]">Role:</span> <strong>—</strong></p></div></div></div></header><Tabs defaultValue="overview"><TabNavigation tabs={tabs} /><TabsContent value="overview"><div className="space-y-5"><section className="grid grid-cols-2 gap-5"><SectionCard title="Personal Information" icon={UserRound}><PersonalInformation /></SectionCard><SectionCard title="Playing Information" icon={Medal}><PlayingInformation /></SectionCard></section><section className="grid grid-cols-3 gap-5"><SectionCard title="Career Summary" icon={FileText}><DetailGrid columns={2}><DetailField label="Matches" /><DetailField label="Formats" /><DetailField label="Runs" /><DetailField label="Wickets" /></DetailGrid></SectionCard><SectionCard title="Fitness Metrics" icon={Activity}><DetailGrid columns={2}><DetailField label="Fitness score" /><DetailField label="Availability" /><DetailField label="Last assessment" /><DetailField label="Medical status" /></DetailGrid></SectionCard><SectionCard title="Selection Status" icon={Medal}><DetailGrid columns={2}><DetailField label="Current status" /><DetailField label="Effective date" /><DetailField label="Squad" /><DetailField label="Notes" /></DetailGrid></SectionCard></section></div></TabsContent><TabsContent value="career"><InformationUnavailable title="No career records available" /></TabsContent><TabsContent value="fitness"><InformationUnavailable title="No fitness information available" /></TabsContent><TabsContent value="documents"><UnavailableFeature title="No documents available" /></TabsContent><TabsContent value="activity"><UnavailableFeature title="No activity recorded" /></TabsContent></Tabs></>;
}
