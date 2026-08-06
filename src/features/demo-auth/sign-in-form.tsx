"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemoAuth } from "./demo-auth-provider";

const signInSchema = z.object({ email: z.email("Enter a valid email-shaped value."), password: z.string().min(1, "Enter a password to continue.") });
type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const { beginDemo } = useDemoAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInValues>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });
  const submit = () => { beginDemo(); router.push("/select-role"); };
  return <form className="mt-8 space-y-5" onSubmit={handleSubmit(submit)} noValidate><div className="space-y-2"><Label htmlFor="email">Email address <span aria-hidden="true" className="text-[var(--danger)]">*</span></Label><Input id="email" type="email" autoComplete="email" placeholder="Enter your email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />{errors.email ? <p id="email-error" className="text-xs text-[var(--danger)]">{errors.email.message}</p> : null}</div><div className="space-y-2"><Label htmlFor="password">Password <span aria-hidden="true" className="text-[var(--danger)]">*</span></Label><Input id="password" type="password" autoComplete="current-password" placeholder="Enter any non-empty value" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} {...register("password")} />{errors.password ? <p id="password-error" className="text-xs text-[var(--danger)]">{errors.password.message}</p> : null}</div><div className="flex gap-3 rounded-[10px] border border-[#d5e1e7] bg-[#eff4f6] p-3 text-xs leading-5 text-[#315b70]"><Info className="mt-0.5 size-4 shrink-0" /><p>Frontend demonstration access. Authentication services are not connected.</p></div><Button className="w-full" disabled={isSubmitting} type="submit">Continue to role selection<ArrowRight /></Button><p className="text-center text-[11px] leading-4 text-[var(--text-muted)]">Credentials are validated only in this browser. The password is never stored.</p></form>;
}
