"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RemoveCasePlayer({
  caseId,
  playerId,
  playerName,
  onChanged,
}: {
  caseId: string;
  playerId: string;
  playerName: string;
  onChanged: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);

  const remove = async () => {
    if (removing) return;

    setRemoving(true);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/players/${encodeURIComponent(playerId)}`,
        { method: "DELETE" },
      );

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to remove this player.");
        return;
      }

      toast.success(`${playerName} removed from the case.`);
      onChanged();
    } catch {
      toast.error("Unable to remove this player.");
    } finally {
      setRemoving(false);
      setConfirming(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {confirming ? (
        <>
          <span className="text-xs text-[var(--text-muted)]">Remove {playerName}?</span>
          <Button type="button" size="sm" variant="danger" disabled={removing} onClick={remove}>
            {removing ? "Removing…" : "Confirm removal"}
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
          aria-label={`Remove ${playerName} from this case`}
          onClick={() => setConfirming(true)}
        >
          <UserMinus className="size-4" />
          Remove
        </Button>
      )}
    </div>
  );
}