"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FilePlus2, RotateCcw, Save } from "lucide-react";
import { FormSection } from "@/components/forms/form-section";
import { ValidationSummary } from "@/components/forms/validation-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth";

const registerComplaintSchema = z.object({
  sourceType: z.string().trim().min(1, "Enter a source type.").max(50),
  dateReceived: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  description: z.string().trim().min(1, "Enter a complaint description.").max(2000),
  misconductType: z.string().trim().max(100).optional().or(z.literal("")),
});

type RegisterComplaintValues = z.infer<typeof registerComplaintSchema>;

const defaults: RegisterComplaintValues = { sourceType: "", dateReceived: "", description: "", misconductType: "" };

export function RegisterComplaint() {
  const { session } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const form = useForm<RegisterComplaintValues>({
    resolver: zodResolver(registerComplaintSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = form;
  const errorMessages = useMemo(
    () => Object.values(errors).flatMap((error) => (error?.message ? [String(error.message)] : [])),
    [errors],
  );

  if (session?.integrityScope !== "MANAGER") {
    return null;
  }

  const submit = async (values: RegisterComplaintValues) => {
    const response = await fetch("/api/integrity/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceType: values.sourceType,
        dateReceived: values.dateReceived || null,
        description: values.description,
        misconductType: values.misconductType || null,
      }),
    });
    const body = await response.json() as { data?: { complaintId: string }; error?: string };

    if (!response.ok || !body.data) {
      setError("root", { message: body.error ?? "Unable to register the complaint." });
      toast.error(body.error ?? "Unable to register the complaint.");
      return;
    }

    toast.success("Complaint registered.");
    setOpen(false);
    reset(defaults);

    const params = new URLSearchParams(searchParams.toString());
    params.set("r", String(refreshKey + 1));
    params.delete("page");
    setRefreshKey((current) => current + 1);
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`);
  };

  return (
    <section className="space-y-4">
      <Button type="button" size="sm" onClick={() => setOpen((current) => !current)}>
        <FilePlus2 />Register complaint
      </Button>
      {open ? (
        <form onSubmit={handleSubmit(submit)} noValidate>
          <FormSection title="Register a complaint" description="Record a complaint source for the integrity registry. Complaint ID is assigned automatically.">
            <ValidationSummary errors={errorMessages} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="register-complaint-source">Source type<span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span></Label>
                <Input id="register-complaint-source" placeholder="e.g. Match referee report" aria-invalid={Boolean(errors.sourceType)} {...register("sourceType")} />
                {errors.sourceType ? <p className="text-xs font-medium text-[var(--danger)]">{errors.sourceType.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-complaint-date">Date received</Label>
                <Input id="register-complaint-date" type="date" aria-invalid={Boolean(errors.dateReceived)} {...register("dateReceived")} />
                {errors.dateReceived ? <p className="text-xs font-medium text-[var(--danger)]">{errors.dateReceived.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-complaint-misconduct">Misconduct type</Label>
                <Input id="register-complaint-misconduct" placeholder="e.g. Breach of conduct" aria-invalid={Boolean(errors.misconductType)} {...register("misconductType")} />
                {errors.misconductType ? <p className="text-xs font-medium text-[var(--danger)]">{errors.misconductType.message}</p> : null}
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <Label htmlFor="register-complaint-description">Description<span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span></Label>
              <Textarea id="register-complaint-description" placeholder="Summarise the reported conduct and the context of the complaint." aria-invalid={Boolean(errors.description)} {...register("description")} />
              {errors.description ? <p className="text-xs font-medium text-[var(--danger)]">{errors.description.message}</p> : null}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => { reset(defaults); setOpen(false); }}><RotateCcw />Cancel</Button>
              <Button type="submit" disabled={isSubmitting}><Save />{isSubmitting ? "Registering…" : "Register complaint"}</Button>
            </div>
          </FormSection>
        </form>
      ) : null}
    </section>
  );
}