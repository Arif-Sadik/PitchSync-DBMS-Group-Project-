"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Send, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CaseLifecycleActions({
  caseId,
  status,
  referralStatus,
  onChanged,
}: {
  caseId: string;
  status: string;
  referralStatus: string;
  onChanged: () => void;
}) {
  const [referOpen, setReferOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmReopen, setConfirmReopen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authority, setAuthority] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const closed = status === "CLOSED";
  const referred = referralStatus === "REFERRED";

  const run = async (action: "refer" | "close" | "reopen", body: Record<string, string>) => {
    if (saving) return;

    setSaving(true);
    setActionError(null);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...body }),
        },
      );

      const result = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Unable to update the case status.");
        return;
      }

      toast.success(action === "refer" ? "Case referred to authority." : action === "close" ? "Case closed." : "Case reopened.");
      setReferOpen(false);
      setConfirmClose(false);
      setConfirmReopen(false);
      setAuthority("");
      onChanged();
    } catch {
      toast.error("Unable to update the case status.");
    } finally {
      setSaving(false);
    }
  };

  const refer = () => {
    const value = authority.trim();
    if (!value) {
      setActionError("Enter the referral authority.");
      return;
    }
    run("refer", { authority: value });
  };

  const close = () => run("close", {});
  const reopen = () => run("reopen", {});

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {closed ? (
        confirmReopen ? (
          <>
            <span className="text-xs text-[var(--text-muted)]">Reopen this case?</span>
            <Button type="button" size="sm" disabled={saving} onClick={reopen}>
              {saving ? "Reopening…" : "Confirm reopen"}
            </Button>
            <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={() => setConfirmReopen(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={() => setConfirmReopen(true)}>
            <RotateCcw className="size-4" />
            Reopen case
          </Button>
        )
      ) : (
        <>
          {!referred ? (
            referOpen ? (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  className="w-56"
                  aria-label="Referral authority"
                  placeholder="Referral authority"
                  value={authority}
                  onChange={(event) => {
                    setAuthority(event.target.value);
                    setActionError(null);
                  }}
                />
                <Button type="button" size="sm" disabled={saving || !authority.trim()} onClick={refer}>
                  {saving ? "Referring…" : "Confirm referral"}
                </Button>
                <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={() => setReferOpen(false)}>
                  Cancel
                </Button>
                {actionError ? <span className="text-xs font-medium text-[var(--danger)]">{actionError}</span> : null}
              </div>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={() => setReferOpen(true)}>
                <Send className="size-4" />
                Refer case
              </Button>
            )
          ) : null}
          {confirmClose ? (
            <>
              <span className="text-xs text-[var(--text-muted)]">Close this case?</span>
              <Button type="button" size="sm" variant="danger" disabled={saving} onClick={close}>
                {saving ? "Closing…" : "Confirm close"}
              </Button>
              <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={() => setConfirmClose(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" size="sm" onClick={() => setConfirmClose(true)}>
              <ShieldX className="size-4" />
              Close case
            </Button>
          )}
        </>
      )}
    </div>
  );
}