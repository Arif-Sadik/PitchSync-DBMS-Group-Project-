"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ClipboardCheck, Pencil, Send } from "lucide-react";
import { SectionCard } from "@/components/data-display/section-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  FindingConclusion,
  FindingRecommendation,
  InvestigationAssignment,
  InvestigationFinding,
} from "@/data/contracts";
import { useApiData } from "@/features/shared/use-api-data";
import {
  conclusionLabels,
  FindingDetails,
  recommendationLabels,
} from "@/features/integrity/04-findings/finding-details";

function FindingForm({
  caseId,
  playerId,
  playerName,
  initial,
  submitLabel,
  onChanged,
  onCancel,
}: {
  caseId: string;
  playerId: string;
  playerName: string;
  initial: Pick<InvestigationFinding, "conclusion" | "description" | "recommendation"> | null;
  submitLabel: string;
  onChanged: () => void;
  onCancel?: () => void;
}) {
  const [conclusion, setConclusion] = useState<FindingConclusion | null>(
    initial?.conclusion ?? null,
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [recommendation, setRecommendation] = useState<FindingRecommendation | null>(
    initial?.recommendation ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async () => {
    const trimmed = description.trim();

    if (!conclusion) {
      setFormError("Choose a conclusion.");
      return;
    }
    if (!trimmed) {
      setFormError("Describe the finding before submitting.");
      return;
    }
    if (!recommendation) {
      setFormError("Choose a recommendation.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/players/${encodeURIComponent(playerId)}/finding`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conclusion,
            description: trimmed,
            recommendation,
          }),
        },
      );

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to submit this finding.");
        return;
      }

      toast.success(initial ? "Finding revised and resubmitted." : "Finding submitted for review.");
      setConclusion(null);
      setDescription("");
      setRecommendation(null);
      onChanged();
    } catch {
      toast.error("Unable to submit this finding.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border bg-white p-4">
      <p className="mb-3 text-sm text-[var(--text-muted)]">
        {initial
          ? `Revise the finding for ${playerName}.`
          : `Submit your finding for ${playerName}.`}
      </p>
      {formError ? <p className="mb-3 text-sm text-[var(--danger)]">{formError}</p> : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`finding-conclusion-${playerId}`}>Conclusion<span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span></Label>
          <Select value={conclusion ?? undefined} onValueChange={(value) => { setConclusion(value as FindingConclusion); setFormError(null); }}>
            <SelectTrigger id={`finding-conclusion-${playerId}`} aria-label="Conclusion">
              <SelectValue placeholder="Select conclusion" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(conclusionLabels) as FindingConclusion[]).map((value) => (
                <SelectItem key={value} value={value}>{conclusionLabels[value]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`finding-recommendation-${playerId}`}>Recommendation<span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span></Label>
          <Select value={recommendation ?? undefined} onValueChange={(value) => { setRecommendation(value as FindingRecommendation); setFormError(null); }}>
            <SelectTrigger id={`finding-recommendation-${playerId}`} aria-label="Recommendation">
              <SelectValue placeholder="Select recommendation" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(recommendationLabels) as FindingRecommendation[]).map((value) => (
                <SelectItem key={value} value={value}>{recommendationLabels[value]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor={`finding-description-${playerId}`}>Finding description<span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span></Label>
        <Textarea id={`finding-description-${playerId}`} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what the evidence and rules show for this player-case involvement." />
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="button" size="sm" disabled={saving} onClick={submit}>
          <Send className="size-4" />
          {saving ? "Submitting…" : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function InvestigatorFindings({
  caseId,
  assignments,
  reload,
  onChanged,
}: {
  caseId: string;
  assignments: readonly InvestigationAssignment[];
  reload: number;
  onChanged: () => void;
}) {
  const state = useApiData<readonly InvestigationFinding[]>(
    `/api/integrity/my-cases/${encodeURIComponent(caseId)}/findings?r=${reload}`,
  );
  const [editing, setEditing] = useState<InvestigationFinding | null>(null);

  if (assignments.length === 0) {
    return (
      <SectionCard title="Finding" description="Submit your formal finding for each player assigned to you." icon={ClipboardCheck}>
        <p className="text-sm text-[var(--text-muted)]">
          No players are assigned to you in this case yet.
        </p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Finding" description="Your formal finding is recorded per assigned player and reviewed by the Manager." icon={ClipboardCheck}>
      {assignments.map((assignment) => {
        const finding =
          state.status === "ready"
            ? state.data?.find((item) => item.playerId === assignment.player.personId)
            : undefined;
        const canRevise = finding?.reviewStatus === "REVISION_REQUESTED";
        const submitted = finding !== undefined;

        return (
          <div key={assignment.player.personId} className="border-t pt-4 first:border-t-0 first:pt-0">
            <p className="text-sm font-medium text-[var(--text)]">
              {assignment.player.fullName} <span className="text-xs text-[var(--text-muted)]">#{assignment.player.personId}</span>
            </p>
            {state.status === "loading" ? (
              <p className="mt-2 text-sm text-[var(--text-muted)]">Loading finding…</p>
            ) : state.status === "error" ? (
              <p className="mt-2 text-sm text-[var(--danger)]">{state.message}</p>
            ) : editing?.playerId === assignment.player.personId ? (
              <FindingForm
                caseId={caseId}
                playerId={assignment.player.personId}
                playerName={assignment.player.fullName}
                initial={{ conclusion: finding!.conclusion, description: finding!.description, recommendation: finding!.recommendation }}
                submitLabel="Submit revision"
                onChanged={onChanged}
                onCancel={() => setEditing(null)}
              />
            ) : !submitted ? (
              <FindingForm
                caseId={caseId}
                playerId={assignment.player.personId}
                playerName={assignment.player.fullName}
                initial={null}
                submitLabel="Submit finding"
                onChanged={onChanged}
              />
            ) : (
              <>
                <FindingDetails finding={finding} />
                {canRevise ? (
                  <div className="mt-4 flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditing(finding)}>
                      <Pencil className="size-4" />
                      Revise finding
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        );
      })}
    </SectionCard>
  );
}