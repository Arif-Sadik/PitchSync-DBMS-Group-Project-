"use client";

import { Suspense } from "react";
import { CircleHelp } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { BackendStatusBadge } from "@/components/feedback/backend-status-badge";
import { DemoStateSwitcher } from "@/components/feedback/demo-state-switcher";
import { RoleBadge } from "@/components/data-display/role-badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDemoAuth } from "@/features/demo-auth";

export function TopBar() {
  const { role } = useDemoAuth();
  if (!role) return null;
  return <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/95 px-7 backdrop-blur"><Breadcrumbs /><div className="flex items-center gap-3"><Suspense><DemoStateSwitcher /></Suspense><BackendStatusBadge /><RoleBadge roleId={role} /><Tooltip><TooltipTrigger asChild><button type="button" className="grid size-9 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)]" aria-label="About this milestone"><CircleHelp className="size-4" /></button></TooltipTrigger><TooltipContent>This is a frontend-only academic project milestone.</TooltipContent></Tooltip></div></header>;
}
