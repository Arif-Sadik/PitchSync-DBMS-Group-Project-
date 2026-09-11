"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PlayerSummary } from "@/data/contracts";

export function AddCasePlayer({
  caseId,
  isManager,
  onChanged,
}: {
  caseId: string;
  isManager: boolean;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [players, setPlayers] = useState<readonly PlayerSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);

  const loading = open && players === null && error === null;

  useEffect(() => {
    if (!open || players !== null) return;

    const controller = new AbortController();

    fetch("/api/integrity/players/options", { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json() as { data?: readonly PlayerSummary[]; error?: string };
        if (!response.ok || !body.data) {
          throw new Error(body.error ?? "Unable to load players.");
        }
        setPlayers(body.data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Unable to load players.");
      });

    return () => controller.abort();
  }, [open, players]);

  if (!isManager) return null;

  const save = async () => {
    if (!selected || saving) return;

    setSaving(true);

    try {
      const response = await fetch(
        `/api/integrity/cases/${encodeURIComponent(caseId)}/players`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId: Number(selected) }),
        },
      );

      const body = await response.json() as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Unable to add this player.");
        return;
      }

      toast.success("Player added to the case.");
      setSelected("");
      onChanged();
    } catch {
      toast.error("Unable to add this player.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4">
      {open ? (
        <div className="rounded-xl border bg-white p-4">
          <p className="mb-3 text-sm text-[var(--text-muted)]">
            Select a player to add to this case.
          </p>
          {error ? (
            <p className="mb-3 text-sm text-[var(--danger)]">{error}</p>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={selected}
              onValueChange={setSelected}
              disabled={saving || loading || error !== null}
            >
              <SelectTrigger aria-label="Select player" className="min-w-64">
                <SelectValue placeholder={loading ? "Loading players…" : "Select player"} />
              </SelectTrigger>
              <SelectContent>
                {players && players.length > 0 ? (
                  players.map((player) => (
                    <SelectItem key={player.personId} value={player.personId}>
                      {player.fullName} — {player.playerRole}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-[var(--text-muted)]">
                    {loading ? "Loading players…" : "No registered players available"}
                  </div>
                )}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                disabled={saving || loading || !selected}
                onClick={save}
              >
                {saving ? "Adding…" : "Add player"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={saving}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          <UserPlus className="size-4" />
          Add player
        </Button>
      )}
    </div>
  );
}