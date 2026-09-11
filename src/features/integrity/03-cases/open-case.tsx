"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { BriefcaseBusiness, Plus, RotateCcw, Save } from "lucide-react";
import { FormSection } from "@/components/forms/form-section";
import { ValidationSummary } from "@/components/forms/validation-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AssignableInvestigator, PlayerSummary } from "@/data/contracts";
import { useAuth } from "@/features/auth";

const openCaseSchema = z.object({
  playerId: z.string().min(1, "Select an involved player."),
  involvementType: z.string().trim().min(1, "Enter an involvement type.").max(100),
  complaintId: z.string(),
  investigatorId: z.string(),
});

type OpenCaseValues = z.infer<typeof openCaseSchema>;

type PendingComplaintShape = {
  complaintId: string;
  dateReceived: string;
  sourceType: string;
  misconductType: string | null;
  description: string;
};

function useOptions<T>(endpoint: string) {
  const [options, setOptions] = useState<readonly T[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(endpoint, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json() as { data?: readonly T[]; error?: string };
        if (!response.ok || !body.data) throw new Error(body.error ?? "Unable to load options.");
        setOptions(body.data);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setError(error instanceof Error ? error.message : "Unable to load options.");
      });

    return () => controller.abort();
  }, [endpoint]);

  return { options, error };
}

const defaults: OpenCaseValues = { playerId: "", involvementType: "", complaintId: "", investigatorId: "" };

export function OpenIntegrityCase() {
  const { session } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const players = useOptions<PlayerSummary>("/api/integrity/players/options");
  const complaints = useOptions<PendingComplaintShape>("/api/integrity/pending-complaints");
  const investigators = useOptions<AssignableInvestigator>("/api/integrity/investigators/assignable");
  const form = useForm<OpenCaseValues>({
    resolver: zodResolver(openCaseSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const { control, register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = form;
  const errorMessages = useMemo(
    () => Object.values(errors).flatMap((error) => (error?.message ? [String(error.message)] : [])),
    [errors],
  );

  if (session?.integrityScope !== "MANAGER") {
    return null;
  }

  const submit = async (values: OpenCaseValues) => {
    const response = await fetch("/api/integrity/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        complaintId: values.complaintId ? Number(values.complaintId) : null,
        playerId: Number(values.playerId),
        involvementType: values.involvementType,
        investigatorId: values.investigatorId ? Number(values.investigatorId) : null,
      }),
    });
    const body = await response.json() as { data?: { caseId: string }; error?: string };

    if (!response.ok || !body.data) {
      setError("root", { message: body.error ?? "Unable to open the integrity case." });
      toast.error(body.error ?? "Unable to open the integrity case.");
      return;
    }

    toast.success("Integrity case opened.");
    setOpen(false);
    reset(defaults);
    router.push(`/integrity/cases/${body.data.caseId}`);
    router.refresh();
  };

  return (
    <section className="space-y-4">
      <Button type="button" size="sm" onClick={() => setOpen((current) => !current)}>
        <Plus />Open Case
      </Button>
      {open ? (
        <form onSubmit={handleSubmit(submit)} noValidate>
          <FormSection title="Open an integrity case" description="Choose an involved player and involvement type; optionally link a complaint and assign an investigator.">
            <ValidationSummary errors={errorMessages} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="open-case-player">Involved player<span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span></Label>
                <Controller
                  name="playerId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="open-case-player" className="w-full" aria-invalid={Boolean(errors.playerId)}>
                        <SelectValue placeholder="Select player" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.options.map((player) => (
                          <SelectItem key={player.personId} value={player.personId}>{player.fullName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.playerId ? <p className="text-xs font-medium text-[var(--danger)]">{errors.playerId.message}</p> : players.error ? <p className="text-xs font-medium text-[var(--danger)]">{players.error}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="open-case-involvement">Involvement type<span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span></Label>
                <Input id="open-case-involvement" placeholder="e.g. Primary Subject" aria-invalid={Boolean(errors.involvementType)} {...register("involvementType")} />
                {errors.involvementType ? <p className="text-xs font-medium text-[var(--danger)]">{errors.involvementType.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="open-case-complaint">Linked complaint (optional)</Label>
                <Controller
                  name="complaintId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="open-case-complaint" className="w-full">
                        <SelectValue placeholder="No complaint" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={""}>No complaint</SelectItem>
                        {complaints.options.map((complaint) => (
                          <SelectItem key={complaint.complaintId} value={complaint.complaintId}>Complaint {complaint.complaintId} — {complaint.sourceType}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {complaints.error ? <p className="text-xs font-medium text-[var(--danger)]">{complaints.error}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="open-case-investigator">Investigator (optional)</Label>
                <Controller
                  name="investigatorId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="open-case-investigator" className="w-full">
                        <SelectValue placeholder="No investigator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={""}>No investigator</SelectItem>
                        {investigators.options.map((investigator) => (
                          <SelectItem key={investigator.investigatorId} value={String(investigator.investigatorId)}>
                            {investigator.investigatorName} — {investigator.activeAssignmentCount} active assignment{investigator.activeAssignmentCount === 1 ? "" : "s"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {investigators.error ? <p className="text-xs font-medium text-[var(--danger)]">{investigators.error}</p> : null}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => { reset(defaults); setOpen(false); }}><RotateCcw />Cancel</Button>
              <Button type="submit" disabled={isSubmitting}><Save />{isSubmitting ? "Opening…" : "Open case"}</Button>
            </div>
          </FormSection>
        </form>
      ) : null}
      <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]"><BriefcaseBusiness className="size-4" />Opening a case records the case, its complaint link, the initial involvement, and any investigator assignment atomically.</p>
    </section>
  );
}
