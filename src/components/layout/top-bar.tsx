"use client";

import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { RoleBadge } from "@/components/data-display/role-badge";
import { useDemoAuth } from "@/features/demo-auth";

export function TopBar() {
  const { role } = useDemoAuth();
  if (!role) return null;
  return <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[rgba(251,248,240,.94)] px-7 backdrop-blur"><Breadcrumbs /><RoleBadge roleId={role} /></header>;
}
