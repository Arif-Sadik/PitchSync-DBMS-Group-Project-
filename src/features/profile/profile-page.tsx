"use client";

import { BriefcaseBusiness, Mail, ShieldCheck, UserRound } from "lucide-react";
import { DetailField } from "@/components/data-display/detail-field";
import { DetailGrid } from "@/components/data-display/detail-grid";
import { EntityHeader } from "@/components/data-display/entity-header";
import { SectionCard } from "@/components/data-display/section-card";
import { Badge } from "@/components/ui/badge";
import { DataStateView } from "@/components/feedback/data-state-view";
import { PageHeader } from "@/components/page/page-header";
import type { CurrentUserProfile } from "@/data/contracts";
import { useApiData } from "@/features/shared/use-api-data";
import { formatDate, formatDateTime } from "@/lib/format-date";
import { accountStatusLabel, initialsOf, isAdminRole } from "./profile-utils";
import { applicationRoleLabel } from "./role-labels";

function MobileNumbers({ numbers }: { numbers: readonly string[] }) {
  return (
    <div className="space-y-1.5">
      {numbers.map((number) => (
        <p key={number} className="text-sm font-medium text-[var(--text)]">{number}</p>
      ))}
    </div>
  );
}

function AdminIdentitySummary({ profile }: { profile: CurrentUserProfile }) {
  return (
    <section className="rounded-xl border bg-[var(--surface-elevated)] p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <span className="heading-font text-lg font-bold tracking-wide">{initialsOf(profile.fullName)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--primary)]">My account</p>
            <h1 className="heading-font mt-1 text-2xl font-semibold tracking-[-0.01em] text-[var(--text)]">{profile.fullName}</h1>
            <p className="mt-1 text-sm font-medium text-[var(--text)]">{profile.designation ?? applicationRoleLabel(profile.role)}</p>
            <p className="text-sm text-[var(--text-muted)]">{profile.department ?? applicationRoleLabel(profile.role)}</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Person ID <strong className="font-semibold text-[var(--text)]">{profile.id}</strong>
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <Badge>{accountStatusLabel(profile.accountStatus)}</Badge>
        </div>
      </div>
    </section>
  );
}

function AdminProfilePage({ profile }: { profile: CurrentUserProfile }) {
  const numbers = profile.mobileNumbers ?? [];

  return (
    <>
      <AdminIdentitySummary profile={profile} />

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Personal Information" icon={UserRound}>
          <DetailGrid columns={2}>
            <DetailField label="Full Name" value={profile.fullName} />
            <DetailField label="Person ID" value={profile.id} />
            {profile.dateOfBirth ? <DetailField label="Date of Birth" value={formatDate(profile.dateOfBirth)} /> : null}
          </DetailGrid>
        </SectionCard>

        <SectionCard title="Contact Information" icon={Mail}>
          <DetailGrid columns={2}>
            {profile.email ? <DetailField label="Email" value={profile.email} /> : null}
            {numbers.length > 0 ? <DetailField label="Mobile Numbers" value={<MobileNumbers numbers={numbers} />} /> : null}
            {profile.presentAddress ? (
              <div className="sm:col-span-2">
                <DetailField label="Present Address" value={profile.presentAddress} />
              </div>
            ) : null}
            {profile.permanentAddress ? (
              <div className="sm:col-span-2">
                <DetailField label="Permanent Address" value={profile.permanentAddress} />
              </div>
            ) : null}
          </DetailGrid>
        </SectionCard>

        <SectionCard title="Professional Information" icon={BriefcaseBusiness}>
          <DetailGrid columns={2}>
            {profile.designation ? <DetailField label="Designation" value={profile.designation} /> : null}
            {profile.department ? <DetailField label="Department" value={profile.department} /> : null}
            {profile.joiningDate ? <DetailField label="Joined" value={formatDate(profile.joiningDate)} /> : null}
          </DetailGrid>
        </SectionCard>

        <SectionCard title="Account Information" icon={ShieldCheck}>
          <DetailGrid columns={2}>
            {profile.username ? <DetailField label="Username" value={profile.username} /> : null}
            <DetailField label="Account Status" value={accountStatusLabel(profile.accountStatus)} />
            {profile.accountCreated ? <DetailField label="Member Since" value={formatDate(profile.accountCreated)} /> : null}
            {profile.lastLogin ? <DetailField label="Last Sign-in" value={formatDateTime(profile.lastLogin)} /> : null}
          </DetailGrid>
        </SectionCard>
      </div>
    </>
  );
}

function PreviousProfilePage({ profile }: { profile: CurrentUserProfile }) {
  const roleLabel = applicationRoleLabel(profile.role);

  return (
    <>
      <PageHeader eyebrow="My account" title="Profile" description="Details of the currently signed-in account." />
      <EntityHeader eyebrow="Current user" title={profile.fullName} referenceLabel="ID" reference={profile.id} loaded>
        <DetailGrid columns={4}>
          <DetailField label="Full Name" value={profile.fullName} />
          <DetailField label="ID" value={profile.id} />
          <DetailField label="Email" value={profile.email ?? "—"} />
          <DetailField label="Designation" value={profile.designation ?? "—"} />
          <DetailField label="Department" value={profile.department ?? "—"} />
          <DetailField label="Application Role" value={roleLabel} />
          <DetailField label="Responsibility" value={profile.responsibility ?? "—"} />
        </DetailGrid>
      </EntityHeader>
    </>
  );
}

function ProfileView({ profile }: { profile: CurrentUserProfile }) {
  return isAdminRole(profile.role) ? <AdminProfilePage profile={profile} /> : <PreviousProfilePage profile={profile} />;
}

export function ProfilePage() {
  const state = useApiData<CurrentUserProfile>("/api/me");
  return <DataStateView state={state} emptyTitle="Profile unavailable">{(profile) => (profile ? <ProfileView profile={profile} /> : null)}</DataStateView>;
}