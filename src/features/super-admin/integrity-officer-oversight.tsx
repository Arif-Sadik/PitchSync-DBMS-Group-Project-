"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page/page-header";
import type {
  AssignableInvestigator,
  IntegrityOfficerListItem,
} from "@/data/contracts";
import type { IntegrityScope } from "@/features/auth/types";
import { RegistryTable } from "@/features/shared/registry-table";
import { useRegistryFilters } from "@/features/shared/use-registry-filters";

const columns = ["Officer", "ID", "Email", "Department", "Account status", "Active assignments", "Responsibility"] as const;

type ReplacementFlow = {
  target: IntegrityScope;
  replacementId: string | null;
};

async function loadAssignableInvestigators() {
  const response = await fetch("/api/super-admin/integrity-officers");
  const body = await response.json() as
    | { assignableInvestigators?: readonly AssignableInvestigator[] }
    | undefined;

  return body?.assignableInvestigators ?? [];
}

function ResponsibilitySelect({
  officer,
}: {
  officer: IntegrityOfficerListItem;
}) {
  const [value, setValue] = useState<IntegrityScope | null>(
    officer.accessScope,
  );
  const [pending, setPending] = useState(false);
  const [flow, setFlow] = useState<ReplacementFlow | null>(null);
  const [replacements, setReplacements] = useState<
    readonly AssignableInvestigator[]
  >([]);

  const update = async (
    next: IntegrityScope,
    replacementInvestigatorId?: number,
  ) => {
    setPending(true);

    try {
      const response = await fetch(
        `/api/super-admin/integrity-officers/${encodeURIComponent(officer.adminId)}/scope`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scope: next,
            ...(replacementInvestigatorId
              ? { replacementInvestigatorId }
              : {}),
          }),
        },
      );

      const body = await response.json() as
        | { error?: string; data?: { reassignedCount?: number } }
        | undefined;

      if (!response.ok) {
        toast.error(body?.error ?? "Unable to update responsibility.");
        return;
      }

      setValue(next);
      setFlow(null);

      const reassigned = body?.data?.reassignedCount ?? 0;

      if (reassigned > 0) {
        toast.success(
          `${reassigned} investigation assignment${reassigned === 1 ? "" : "s"} transferred before switching to Manager.`,
        );
      } else {
        toast.success("Integrity responsibility updated.");
      }
    } catch {
      toast.error("Unable to update responsibility.");
    } finally {
      setPending(false);
    }
  };

  const change = async (next: IntegrityScope) => {
    if (next === value) return;

    const needsReplacement =
      officer.accessScope === "INVESTIGATOR" &&
      next === "MANAGER" &&
      officer.activeAssignmentCount > 0;

    if (!needsReplacement) {
      await update(next);
      return;
    }

    setReplacements(
      await loadAssignableInvestigators().catch(
        () => [] as readonly AssignableInvestigator[],
      ),
    );
    setFlow({ target: next, replacementId: null });
  };

  const confirm = async () => {
    if (!flow?.replacementId) return;

    await update(
      flow.target,
      Number(flow.replacementId),
    );
  };

  const cancel = () => {
    setFlow(null);
  };

  const available = replacements.filter(
    (replacement) =>
      replacement.investigatorId !== Number(officer.adminId),
  );

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={value ?? ""}
        onValueChange={(selected) => change(selected as IntegrityScope)}
        disabled={pending}
      >
        <SelectTrigger
          aria-label={`Responsibility for ${officer.fullName}`}
          className="w-full min-w-44"
          disabled={pending}
        >
          <SelectValue placeholder="Not assigned" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="MANAGER">Manager</SelectItem>
          <SelectItem value="INVESTIGATOR">Investigator</SelectItem>
        </SelectContent>
      </Select>

      {flow ? (
        <div className="flex w-full min-w-72 flex-col gap-2 rounded-lg border p-3 shadow-sm">
          <p className="text-xs text-[var(--text-muted)]">
            Switching to Manager will stop this officer from
            investigating. Choose an investigator to take over the{" "}
            <strong>{officer.activeAssignmentCount}</strong> active
            investigation assignment
            {officer.activeAssignmentCount === 1 ? "" : "s"}.
          </p>

          <Select
            value={flow.replacementId ?? ""}
            onValueChange={(selected) =>
              setFlow({ ...flow, replacementId: selected })
            }
          >
            <SelectTrigger
              aria-label="Replacement investigator"
              className="w-full"
            >
              <SelectValue placeholder="Select replacement investigator" />
            </SelectTrigger>
            <SelectContent>
              {available.length === 0 ? (
                <SelectItem value="__none__" disabled>
                  No other investigators are available
                </SelectItem>
              ) : (
                available.map((replacement) => (
                  <SelectItem
                    key={replacement.investigatorId}
                    value={String(replacement.investigatorId)}
                  >
                    {replacement.investigatorName} —{" "}
                    {replacement.activeAssignmentCount} active
                    assignment
                    {replacement.activeAssignmentCount === 1 ? "" : "s"}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={cancel}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={confirm}
              disabled={!flow.replacementId || pending}
            >
              Reassign &amp; switch to Manager
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function IntegrityOfficerOversight() {
  const { state } = useRegistryFilters<IntegrityOfficerListItem>(
    "No Integrity Officers are currently registered.",
    "/api/super-admin/integrity-officers",
  );

  return (
    <>
      <PageHeader
        eyebrow="System administration"
        title="Integrity Officers"
        description="Review active Integrity & Compliance Officers and assign each person's current management responsibility."
      />
      <RegistryTable
        columns={columns}
        state={state}
        emptyTitle="No Integrity Officers found"
        emptyDescription="No active Integrity & Compliance Officers are registered."
        renderRow={(officer) => ({
          key: officer.adminId,
          cells: [
            <span key="name" className="font-semibold">{officer.fullName}</span>,
            officer.adminId,
            officer.email,
            officer.department,
            officer.accountStatus ? (
              <Badge key="status" variant="default">{officer.accountStatus}</Badge>
            ) : (
              <span key="status" className="text-[var(--text-muted)]">—</span>
            ),
            <span key="assignments" className="tabular-nums">
              {officer.activeAssignmentCount}
            </span>,
            <ResponsibilitySelect key="scope" officer={officer} />,
          ],
        })}
      />
      <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <ShieldCheck className="size-4" />
        Only a Super Administrator can change an Integrity Officer&apos;s responsibility.
      </p>
    </>
  );
}