"use client";

import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { roles } from "@/config/roles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/feedback/loading-state";
import { useDemoAuth } from "./demo-auth-provider";

export function RoleSelector() {
  const auth = useDemoAuth();
  const router = useRouter();
  useEffect(() => { if (auth.hydrated && !auth.signedIn) router.replace("/sign-in"); }, [auth.hydrated, auth.signedIn, router]);
  if (!auth.hydrated || !auth.signedIn) return <LoadingState title="Preparing role selection" />;
  const choose = (roleId: (typeof roles)[number]["id"], route: string) => { auth.selectRole(roleId); router.push(route); };
  return <div className="grid grid-cols-3 gap-4">{roles.map((role) => { const Icon = role.icon; return <Card key={role.id} className="group flex min-h-56 flex-col p-5 transition duration-150 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-[0_10px_30px_rgba(13,38,48,.07)]" style={{ "--primary": role.accent, "--primary-hover": role.accentHover, "--primary-soft": role.accentSoft } as React.CSSProperties}><div className="grid size-11 place-items-center rounded-[10px] bg-[var(--primary-soft)]"><Icon className="size-5 text-[var(--primary)]" /></div><h2 className="mt-5 text-base font-semibold">{role.label}</h2><p className="mt-2 flex-1 text-sm leading-5 text-[var(--text-muted)]">{role.description}</p><Button type="button" variant="ghost" className="mt-5 justify-between px-0 text-[var(--primary)] hover:bg-transparent hover:text-[var(--primary-hover)]" onClick={() => choose(role.id, role.dashboardRoute)}>Open workspace<ArrowRight className="transition-transform group-hover:translate-x-1" /></Button></Card>; })}</div>;
}
