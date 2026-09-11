"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookOpen, Link2, Unlink } from "lucide-react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { SectionCard } from "@/components/data-display/section-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RulebookListItem, RulebookRecord } from "@/data/contracts";

function UnlinkRuleButton({
  caseId,
  rule,
  onChanged,
}: {
  caseId: string;
  rule: RulebookRecord;
  onChanged: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);

  const remove = async () => {
    if (removing) return;

    setRemoving(true);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/rules/${encodeURIComponent(rule.ruleId)}`,
        { method: "DELETE" },
      );

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to unlink this rule.");
        return;
      }

      toast.success("Rule unlinked from the case.");
      onChanged();
    } catch {
      toast.error("Unable to unlink this rule.");
    } finally {
      setRemoving(false);
      setConfirming(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {confirming ? (
        <>
          <span className="text-xs text-[var(--text-muted)]">Unlink {rule.clauseNumber}?</span>
          <Button type="button" size="sm" variant="danger" disabled={removing} onClick={remove}>
            {removing ? "Unlinking…" : "Confirm"}
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
          aria-label={`Unlink rule ${rule.clauseNumber} from this case`}
          onClick={() => setConfirming(true)}
        >
          <Unlink className="size-4" />
          Unlink
        </Button>
      )}
    </div>
  );
}

function LinkRuleControl({
  caseId,
  linkedRuleIds,
  onChanged,
}: {
  caseId: string;
  linkedRuleIds: readonly string[];
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [rules, setRules] = useState<readonly RulebookListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);

  const loading = open && rules === null && error === null;

  useEffect(() => {
    if (!open || rules !== null) return;

    const controller = new AbortController();

    fetch("/api/integrity/rulebook?page=1&pageSize=100", { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json() as { data?: readonly RulebookListItem[]; error?: string };
        if (!response.ok || !body.data) {
          throw new Error(body.error ?? "Unable to load rules.");
        }
        setRules(body.data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Unable to load rules.");
      });

    return () => controller.abort();
  }, [open, rules]);

  const available = (rules ?? []).filter(
    (rule) => !linkedRuleIds.includes(rule.ruleId),
  );

  const save = async () => {
    if (!selected || saving) return;

    setSaving(true);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/rules`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ruleId: Number(selected) }),
        },
      );

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to link this rule.");
        return;
      }

      toast.success("Rule linked to the case.");
      setSelected("");
      onChanged();
    } catch {
      toast.error("Unable to link this rule.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4">
      {open ? (
        <div className="rounded-xl border bg-white p-4">
          <p className="mb-3 text-sm text-[var(--text-muted)]">
            Select a rulebook clause to record as a violation of this case.
          </p>
          {error ? <p className="mb-3 text-sm text-[var(--danger)]">{error}</p> : null}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={selected} onValueChange={setSelected} disabled={saving || loading || error !== null}>
              <SelectTrigger aria-label="Select rule" className="min-w-64">
                <SelectValue placeholder={loading ? "Loading rules…" : "Select rule"} />
              </SelectTrigger>
              <SelectContent>
                {available.length > 0 ? (
                  available.map((rule) => (
                    <SelectItem key={rule.ruleId} value={rule.ruleId}>
                      {rule.clauseNumber} — {rule.category}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-[var(--text-muted)]">
                    {loading ? "Loading rules…" : "All rulebook clauses are already linked"}
                  </div>
                )}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button type="button" size="sm" disabled={saving || loading || !selected} onClick={save}>
                {saving ? "Linking…" : "Link rule"}
              </Button>
              <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Link2 className="size-4" />
          Link rule
        </Button>
      )}
    </div>
  );
}

export function CaseRuleManager({
  caseId,
  rules,
  onChanged,
}: {
  caseId: string;
  rules: readonly RulebookRecord[];
  onChanged: () => void;
}) {
  return (
    <SectionCard title="Rules linked as violations" description="Link a rulebook clause to this case as a recorded violation, or unlink one." icon={BookOpen}>
      <DataTableShell
        minWidth={640}
        columns={["Rule ID", "Clause number", "Category", "Actions"]}
        emptyTitle="No rule violations linked"
        rows={rules.map((rule) => ({
          key: rule.ruleId,
          cells: [
            rule.ruleId,
            rule.clauseNumber,
            rule.category,
            <UnlinkRuleButton key="unlink" caseId={caseId} rule={rule} onChanged={onChanged} />,
          ],
        }))}
      />
      <LinkRuleControl caseId={caseId} linkedRuleIds={rules.map((rule) => rule.ruleId)} onChanged={onChanged} />
    </SectionCard>
  );
}