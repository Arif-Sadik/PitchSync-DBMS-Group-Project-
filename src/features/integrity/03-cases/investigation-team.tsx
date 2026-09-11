"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserRoundCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataStateView } from "@/components/feedback/data-state-view";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { SectionCard } from "@/components/data-display/section-card";
import type { AssignableInvestigator, IntegrityInvestigator, InvestigationAssignment } from "@/data/contracts";
import { useApiData } from "@/features/shared/use-api-data";

type Props = {
  caseId: string;
  involvedPlayers: readonly InvestigationAssignment[];
  investigators: readonly IntegrityInvestigator[];
  reload: number;
  onChanged: () => void;
};

function AssignControl({
  caseId,
  playerId,
  playerName,
  currentId,
  options,
  onChanged,
}: {
  caseId: string;
  playerId: string;
  playerName: string;
  currentId: string;
  options: readonly AssignableInvestigator[];
  onChanged: () => void;
}) {
  const [selected, setSelected] = useState<string>(currentId);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!selected) return;

    setSaving(true);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/players/${encodeURIComponent(playerId)}/investigator`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ investigatorId: Number(selected) }),
        },
      );

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to update the investigator assignment.");
        return;
      }

      toast.success(currentId ? "Investigator reassigned." : "Investigator assigned.");
      onChanged();
    } catch {
      toast.error("Unable to update the investigator assignment.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selected} onValueChange={setSelected} disabled={saving}>
        <SelectTrigger aria-label={`Select investigator for ${playerName}`} className="min-w-44">
          <SelectValue placeholder="Select investigator" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.investigatorId} value={String(option.investigatorId)}>
              {option.investigatorName} — {option.activeAssignmentCount} active assignment{option.activeAssignmentCount === 1 ? "" : "s"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" variant="outline" size="sm" disabled={saving || !selected} onClick={save}>
        {saving ? "Saving…" : currentId ? "Reassign" : "Assign"}
      </Button>
    </div>
  );
}

export function InvestigationTeamManager({
  caseId,
  involvedPlayers,
  investigators,
  reload,
  onChanged,
}: Props) {
  const state = useApiData<readonly AssignableInvestigator[]>(
    `/api/integrity/investigators/assignable?r=${reload}`,
  );

  return (
    <SectionCard
      title="Investigation team"
      description="Assign or reassign an eligible investigator for each involved player in this case."
      icon={UserRoundCog}
    >
      <DataStateView state={state} emptyTitle="No assignable investigators">
        {(options) => (
          <DataTableShell
            minWidth={880}
            columns={["Player", "Current investigator", "Active workload", "Action"]}
            emptyTitle="No involved players"
            rows={involvedPlayers.map((assignment) => {
              const currentId = assignment.investigatorIds[0] ?? "";
              const current = currentId
                ? investigators.find(
                    (investigator) => investigator.administratorId === currentId,
                  )
                : undefined;
              const workload = (options ?? []).find(
                (option) => String(option.investigatorId) === currentId,
              );
              return {
                key: assignment.player.personId,
                cells: [
                  <div key="player">
                    <p className="truncate font-medium">{assignment.player.fullName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{assignment.player.personId}</p>
                  </div>,
                  current
                    ? `${current.fullName}${current.designation ? ` · ${current.designation}` : ""}`
                    : "Unassigned",
                  current
                    ? workload
                      ? `${workload.activeAssignmentCount} active assignment${workload.activeAssignmentCount === 1 ? "" : "s"}`
                      : "Unavailable"
                    : "—",
                  <AssignControl
                    key="action"
                    caseId={caseId}
                    playerId={assignment.player.personId}
                    playerName={assignment.player.fullName}
                    currentId={currentId}
                    options={options ?? []}
                    onChanged={onChanged}
                  />,
                ],
              };
            })}
          />
        )}
      </DataStateView>
    </SectionCard>
  );
}