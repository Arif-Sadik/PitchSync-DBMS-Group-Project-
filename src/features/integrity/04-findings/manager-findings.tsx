"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, FileSearch, Send, Undo2, XCircle } from "lucide-react";
import { SectionCard } from "@/components/data-display/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  FindingRecommendation,
  FindingReviewStatus,
  InvestigationFinding,
} from "@/data/contracts";
import { useApiData } from "@/features/shared/use-api-data";
import {
  FindingDetails,
  recommendationLabels,
} from "@/features/integrity/04-findings/finding-details";

type ActionState =
  | { kind: "" }
  | {
      kind: "review";
      reviewStatus: "REVISION_REQUESTED" | "REJECTED";
    }
  | { kind: "acceptAndRefer" }
  | { kind: "acceptAndClose" };

type PrimaryAction =
  | { kind: "accept"; label: string }
  | { kind: "acceptAndRefer"; label: string }
  | { kind: "acceptAndClose"; label: string }
  | { kind: "requestFurther"; label: string };

const primaryByRecommendation: Record<FindingRecommendation, PrimaryAction> = {
  EXTERNAL_REFERRAL: { kind: "acceptAndRefer", label: "Accept & Refer" },
  CLOSE_CASE: { kind: "acceptAndClose", label: "Accept & Close" },
  FURTHER_INVESTIGATION: { kind: "requestFurther", label: "Request Further Investigation" },
  NO_ACTION: { kind: "accept", label: "Accept" },
};

function AcceptActionButton({
  caseId,
  playerId,
  onDone,
}: {
  caseId: string;
  playerId: string;
  onDone: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const accept = async () => {
    if (saving) return;

    setSaving(true);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/players/${encodeURIComponent(playerId)}/finding/review`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewStatus: "ACCEPTED" }),
        },
      );

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to accept this finding.");
        return;
      }

      toast.success("Finding accepted.");
      onDone();
    } catch {
      toast.error("Unable to accept this finding.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button type="button" size="sm" disabled={saving} onClick={accept}>
      <CheckCircle2 className="size-4" />
      {saving ? "Accepting…" : "Accept"}
    </Button>
  );
}

function AcceptAndReferForm({
  caseId,
  playerId,
  recommendationLabel,
  onDone,
  onCancel,
}: {
  caseId: string;
  playerId: string;
  recommendationLabel: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [authority, setAuthority] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async () => {
    const value = authority.trim();

    if (!value) {
      setFormError("Enter the referral authority.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/players/${encodeURIComponent(playerId)}/finding/review`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewStatus: "ACCEPTED",
            caseAction: "refer",
            authority: value,
          }),
        },
      );

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to accept and refer this case.");
        return;
      }

      toast.success("Finding accepted and the case referred to authority.");
      onDone();
    } catch {
      toast.error("Unable to accept and refer this case.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border bg-white p-4">
      <p className="mb-3 text-sm text-[var(--text-muted)]">
        Accepting the {recommendationLabel} recommendation will also refer this case to authority.
      </p>
      {formError ? <p className="mb-3 text-sm text-[var(--danger)]">{formError}</p> : null}
      <div className="space-y-2">
        <Label htmlFor={`refer-authority-${playerId}`}>Referral authority<span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span></Label>
        <Input id={`refer-authority-${playerId}`} value={authority} onChange={(event) => { setAuthority(event.target.value); setFormError(null); }} placeholder="Referral authority" />
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="button" size="sm" disabled={saving || !authority.trim()} onClick={submit}>
          <Send className="size-4" />
          {saving ? "Processing…" : "Confirm accept & refer"}
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function AcceptCloseConfirm({
  caseId,
  playerId,
  recommendationLabel,
  onDone,
  onCancel,
}: {
  caseId: string;
  playerId: string;
  recommendationLabel: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async () => {
    if (saving) return;

    setSaving(true);
    setFormError(null);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/players/${encodeURIComponent(playerId)}/finding/review`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewStatus: "ACCEPTED",
            caseAction: "close",
          }),
        },
      );

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to accept and close this case.");
        return;
      }

      toast.success("Finding accepted and the case closed.");
      onDone();
    } catch {
      toast.error("Unable to accept and close this case.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <span className="text-xs text-[var(--text-muted)]">
        Accept the {recommendationLabel} recommendation and close case {caseId}?
      </span>
      {formError ? <span className="text-sm text-[var(--danger)]">{formError}</span> : null}
      <Button type="button" size="sm" variant="danger" disabled={saving} onClick={submit}>
        {saving ? "Processing…" : "Confirm accept & close"}
      </Button>
      <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={onCancel}>
        Cancel
      </Button>
    </>
  );
}

function ReviewForm({
  caseId,
  playerId,
  reviewStatus,
  commentRequired,
  submitLabel,
  onReview,
  onCancel,
}: {
  caseId: string;
  playerId: string;
  reviewStatus: Exclude<FindingReviewStatus, "PENDING">;
  commentRequired: boolean;
  submitLabel: string;
  onReview: () => void;
  onCancel: () => void;
}) {
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async () => {
    const trimmed = comment.trim();

    if (commentRequired && !trimmed) {
      setFormError("A manager comment is required for this review.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/players/${encodeURIComponent(playerId)}/finding/review`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewStatus,
            ...(trimmed ? { managerComment: trimmed } : {}),
          }),
        },
      );

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to review this finding.");
        return;
      }

      toast.success(reviewStatus === "ACCEPTED" ? "Finding accepted." : reviewStatus === "REVISION_REQUESTED" ? "Revision requested." : "Finding rejected.");
      setComment("");
      onReview();
    } catch {
      toast.error("Unable to review this finding.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border bg-white p-4">
      <p className="mb-3 text-sm text-[var(--text-muted)]">
        {commentRequired
          ? "Explain the reason to the investigator."
          : "Add an optional note before accepting."}
      </p>
      {formError ? <p className="mb-3 text-sm text-[var(--danger)]">{formError}</p> : null}
      <div className="space-y-2">
        <Label htmlFor={`review-comment-${playerId}`}>Manager comment{commentRequired ? <span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span> : null}</Label>
        <Textarea id={`review-comment-${playerId}`} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add your comment for the investigator." />
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="button" size="sm" disabled={saving} onClick={submit}>
          {saving ? "Saving…" : submitLabel}
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function ManagerFindings({
  caseId,
  reload,
  onChanged,
}: {
  caseId: string;
  reload: number;
  onChanged: () => void;
}) {
  const state = useApiData<readonly InvestigationFinding[]>(
    `/api/integrity/cases/${encodeURIComponent(caseId)}/findings?r=${reload}`,
  );
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [action, setAction] = useState<ActionState>({ kind: "" });

  const close = () => {
    setPlayerId(null);
    setAction({ kind: "" });
    onChanged();
  };

  if (state.status === "loading") {
    return (
      <SectionCard title="Findings" icon={FileSearch}>
        <p className="text-sm text-[var(--text-muted)]">Loading findings…</p>
      </SectionCard>
    );
  }

  if (state.status === "error") {
    return (
      <SectionCard title="Findings" icon={FileSearch}>
        <p className="text-sm text-[var(--danger)]">{state.message}</p>
      </SectionCard>
    );
  }

  const findings = state.data ?? [];

  return (
    <SectionCard title="Findings" description="One finding per player-case involvement, submitted by the assigned investigator." icon={FileSearch}>
      {findings.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          No findings have been submitted for this case yet.
        </p>
      ) : (
        findings.map((finding) => {
          const isActive = playerId === finding.playerId && action.kind !== "";
          const primary = primaryByRecommendation[finding.recommendation];
          const recommendationLabel = recommendationLabels[finding.recommendation];

          return (
            <div key={finding.playerId} className="border-t pt-4 first:border-t-0 first:pt-0">
              <p className="text-sm font-medium text-[var(--text)]">
                {finding.playerName} <span className="text-xs text-[var(--text-muted)]">#{finding.playerId}</span>
                <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">by {finding.investigatorName}</span>
              </p>
              <FindingDetails finding={finding} />
              {finding.reviewStatus === "PENDING" ? (
                isActive && action.kind === "review" ? (
                  <ReviewForm
                    caseId={caseId}
                    playerId={finding.playerId}
                    reviewStatus={action.reviewStatus}
                    commentRequired
                    submitLabel={action.reviewStatus === "REVISION_REQUESTED" ? "Confirm request" : "Confirm rejection"}
                    onReview={close}
                    onCancel={() => setAction({ kind: "" })}
                  />
                ) : isActive && action.kind === "acceptAndRefer" ? (
                  <AcceptAndReferForm
                    caseId={caseId}
                    playerId={finding.playerId}
                    recommendationLabel={recommendationLabel}
                    onDone={close}
                    onCancel={() => setAction({ kind: "" })}
                  />
                ) : isActive && action.kind === "acceptAndClose" ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <AcceptCloseConfirm
                      caseId={caseId}
                      playerId={finding.playerId}
                      recommendationLabel={recommendationLabel}
                      onDone={close}
                      onCancel={() => setAction({ kind: "" })}
                    />
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {primary.kind === "accept" ? (
                      <AcceptActionButton caseId={caseId} playerId={finding.playerId} onDone={close} />
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        disabled={isActive}
                        onClick={() => {
                          setPlayerId(finding.playerId);
                          setAction(
                            primary.kind === "acceptAndRefer"
                              ? { kind: "acceptAndRefer" }
                              : primary.kind === "acceptAndClose"
                                ? { kind: "acceptAndClose" }
                                : { kind: "review", reviewStatus: "REVISION_REQUESTED" },
                          );
                        }}
                      >
                        {primary.kind === "requestFurther" ? <Undo2 className="size-4" /> : <Send className="size-4" />}
                        {primary.label}
                      </Button>
                    )}
                    {finding.recommendation === "FURTHER_INVESTIGATION" ? null : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isActive}
                        onClick={() => {
                          setPlayerId(finding.playerId);
                          setAction({ kind: "review", reviewStatus: "REVISION_REQUESTED" });
                        }}
                      >
                        <Undo2 className="size-4" />
                        Request revision
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      disabled={isActive}
                      onClick={() => {
                        setPlayerId(finding.playerId);
                        setAction({ kind: "review", reviewStatus: "REJECTED" });
                      }}
                    >
                      <XCircle className="size-4" />
                      Reject
                    </Button>
                  </div>
                )
              ) : null}
            </div>
          );
        })
      )}
    </SectionCard>
  );
}