"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileSearch, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { SectionCard } from "@/components/data-display/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EvidenceRecord } from "@/data/contracts";
import { formatDate } from "@/lib/format-date";

function toDateInputValue(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function EvidenceForm({
  caseId,
  evidenceNumber,
  initial,
  saving,
  onSave,
  setSaving,
  onChanged,
}: {
  caseId: string;
  evidenceNumber: string | null;
  initial: { description: string; collectedDate: string } | null;
  saving: boolean;
  setSaving: (value: boolean) => void;
  onSave: () => void;
  onChanged: () => void;
}) {
  const [description, setDescription] = useState(initial?.description ?? "");
  const [collectedDate, setCollectedDate] = useState(initial?.collectedDate ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async () => {
    const trimmed = description.trim();
    if (!trimmed) {
      setFormError("Enter a description for this evidence item.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(collectedDate)) {
      setFormError("Choose a collected date.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const endpoint = evidenceNumber === null
        ? `/api/integrity/cases/${encodeURIComponent(caseId)}/evidence`
        : `/api/integrity/cases/${encodeURIComponent(caseId)}/evidence/${encodeURIComponent(evidenceNumber)}`;
      const method = evidenceNumber === null ? "POST" : "PATCH";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: trimmed, collectedDate }),
      });

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to save this evidence item.");
        return;
      }

      toast.success(evidenceNumber === null ? "Evidence added to the case." : "Evidence updated.");
      onChanged();
    } catch {
      toast.error("Unable to save this evidence item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border bg-white p-4">
      <p className="mb-3 text-sm text-[var(--text-muted)]">
        {evidenceNumber === null
          ? "Provide the details of the evidence item to record."
          : `Update evidence ${evidenceNumber}.`}
      </p>
      {formError ? <p className="mb-3 text-sm text-[var(--danger)]">{formError}</p> : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
        <div className="space-y-2">
          <Label htmlFor={`evidence-description-${evidenceNumber ?? "new"}`}>Description<span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span></Label>
          <Textarea id={`evidence-description-${evidenceNumber ?? "new"}`} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the evidence item and its relevance." />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`evidence-date-${evidenceNumber ?? "new"}`}>Collected date<span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span></Label>
          <Input id={`evidence-date-${evidenceNumber ?? "new"}`} type="date" value={collectedDate} onChange={(event) => setCollectedDate(event.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="button" size="sm" disabled={saving} onClick={submit}>
          <Save className="size-4" />
          {saving ? "Saving…" : "Save evidence"}
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={onSave}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function RemoveEvidenceButton({
  caseId,
  evidence,
  onChanged,
}: {
  caseId: string;
  evidence: EvidenceRecord;
  onChanged: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);

  const remove = async () => {
    if (removing) return;

    setRemoving(true);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/evidence/${encodeURIComponent(evidence.evidenceNumber)}`,
        { method: "DELETE" },
      );

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to remove this evidence item.");
        return;
      }

      toast.success("Evidence item removed.");
      onChanged();
    } catch {
      toast.error("Unable to remove this evidence item.");
    } finally {
      setRemoving(false);
      setConfirming(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {confirming ? (
        <>
          <span className="text-xs text-[var(--text-muted)]">Remove evidence {evidence.evidenceNumber}?</span>
          <Button type="button" size="sm" variant="danger" disabled={removing} onClick={remove}>
            {removing ? "Removing…" : "Confirm"}
          </Button>
          <Button type="button" variant="ghost" size="sm" disabled={removing} onClick={() => setConfirming(false)}>
            Cancel
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Remove evidence ${evidence.evidenceNumber}`}
          onClick={() => setConfirming(true)}
        >
          <Trash2 className="size-4" />
          Remove
        </Button>
      )}
    </div>
  );
}

export function CaseEvidenceManager({
  caseId,
  evidence,
  onChanged,
}: {
  caseId: string;
  evidence: readonly EvidenceRecord[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<EvidenceRecord | "new" | null>(null);
  const [saving, setSaving] = useState(false);

  const closeForm = () => {
    if (saving) return;
    setEditing(null);
  };

  const handleChanged = () => {
    setEditing(null);
    setSaving(false);
    onChanged();
  };

  return (
    <SectionCard title="Case evidence" description="Evidence is identified within this case by its evidence number." icon={FileSearch}>
      <DataTableShell
        minWidth={720}
        columns={["Evidence number", "Description", "Collected date", "Actions"]}
        emptyTitle="No evidence available"
        rows={evidence.map((item) => ({
          key: item.evidenceNumber,
          cells: [
            item.evidenceNumber,
            item.description,
            formatDate(item.collectedDate),
            <div key="actions" className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label={`Edit evidence ${item.evidenceNumber}`}
                disabled={editing !== null}
                onClick={() => setEditing(item)}
              >
                <Pencil className="size-4" />
                Edit
              </Button>
              <RemoveEvidenceButton caseId={caseId} evidence={item} onChanged={handleChanged} />
            </div>,
          ],
        }))}
      />
      {editing !== null ? (
        <EvidenceForm
          key={editing === "new" ? "new" : editing.evidenceNumber}
          caseId={caseId}
          evidenceNumber={editing === "new" ? null : editing.evidenceNumber}
          initial={editing === "new" ? null : { description: editing.description, collectedDate: toDateInputValue(editing.collectedDate) }}
          saving={saving}
          setSaving={setSaving}
          onSave={closeForm}
          onChanged={handleChanged}
        />
      ) : (
        <div className="mt-4">
          <Button type="button" variant="outline" size="sm" onClick={() => setEditing("new")}>
            <Plus className="size-4" />
            Add evidence
          </Button>
        </div>
      )}
    </SectionCard>
  );
}