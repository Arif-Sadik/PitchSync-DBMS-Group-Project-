"use client";

import Link from "next/link";
import { SectionCard } from "@/components/data-display/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CurrentUserProfile } from "@/data/contracts";
import { useApiData } from "@/features/shared/use-api-data";
import { accountStatusLabel, initialsOf, isAdminRole } from "./profile-utils";
import { applicationRoleLabel } from "./role-labels";

export function CurrentUserCard() {
  const state = useApiData<CurrentUserProfile>("/api/me");
  const profile = state.status === "ready" ? state.data : null;

  if (!profile) {
    return null;
  }

  const roleLabel = applicationRoleLabel(profile.role);
  const subtitle = profile.designation ?? roleLabel;
  const meta = profile.department ?? roleLabel;
  const status = isAdminRole(profile.role) ? accountStatusLabel(profile.accountStatus) : undefined;

  return (
    <SectionCard title="">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
            <span className="heading-font text-base font-bold tracking-wide">{initialsOf(profile.fullName)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-[var(--text-muted)]">Welcome, {profile.fullName}</p>
            <p className="heading-font mt-1 text-xl font-semibold text-[var(--text)]">{subtitle}</p>
            <p className="mt-1 truncate text-sm text-[var(--text-muted)]">{meta}</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Person ID <strong className="font-semibold text-[var(--text)]">{profile.id}</strong>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center">
          {status ? <Badge>{status}</Badge> : null}
          <Button asChild variant="outline" size="sm"><Link href="/profile">View Profile</Link></Button>
        </div>
      </div>
    </SectionCard>
  );
}