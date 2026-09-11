"use client";

import { DetailField } from "@/components/data-display/detail-field";
import { DetailGrid } from "@/components/data-display/detail-grid";
import type {
  FindingConclusion,
  FindingRecommendation,
  FindingReviewStatus,
  InvestigationFinding,
} from "@/data/contracts";
import { formatDateTime } from "@/lib/format-date";

export const conclusionLabels: Record<FindingConclusion, string> = {
  SUBSTANTIATED: "Substantiated",
  NOT_SUBSTANTIATED: "Not substantiated",
  INCONCLUSIVE: "Inconclusive",
};

export const recommendationLabels: Record<FindingRecommendation, string> = {
  CLOSE_CASE: "Close the case",
  EXTERNAL_REFERRAL: "External referral",
  FURTHER_INVESTIGATION: "Further investigation",
  NO_ACTION: "No action",
};

export const reviewStatusLabels: Record<FindingReviewStatus, string> = {
  PENDING: "Pending manager review",
  ACCEPTED: "Accepted",
  REVISION_REQUESTED: "Revision requested",
  REJECTED: "Rejected",
};

export function FindingDetails({
  finding,
  showOwner,
}: {
  finding: InvestigationFinding;
  showOwner?: boolean;
}) {
  return (
    <div className="mt-4 space-y-4">
      {showOwner ? (
        <DetailGrid columns={2}>
          <DetailField label="Player" value={`${finding.playerName} (#${finding.playerId})`} />
          <DetailField label="Investigator" value={finding.investigatorName} />
        </DetailGrid>
      ) : null}
      <DetailGrid columns={3}>
        <DetailField label="Conclusion" value={conclusionLabels[finding.conclusion]} />
        <DetailField label="Recommendation" value={recommendationLabels[finding.recommendation]} />
        <DetailField label="Submitted" value={formatDateTime(finding.submittedAt)} />
      </DetailGrid>
      <DetailField label="Review status" value={reviewStatusLabels[finding.reviewStatus]} />
      <div className="rounded-lg border bg-[var(--surface)] p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Finding description</p>
        <p className="text-sm leading-relaxed text-[var(--text)]">{finding.description}</p>
      </div>
      {finding.managerComment ? (
        <div className="rounded-lg border bg-[var(--surface)] p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Manager comment</p>
          <p className="text-sm leading-relaxed text-[var(--text)]">{finding.managerComment}</p>
        </div>
      ) : null}
      {finding.reviewedAt ? (
        <p className="text-xs text-[var(--text-muted)]">
          Reviewed by {finding.reviewerName ?? "Manager"} on {formatDateTime(finding.reviewedAt)}.
        </p>
      ) : null}
    </div>
  );
}