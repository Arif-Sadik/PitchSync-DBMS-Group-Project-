"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { routeLabels } from "@/config/navigation";
import { getRole } from "@/config/roles";
import { useDemoAuth } from "@/features/demo-auth";

export function Breadcrumbs() {
  const pathname = usePathname();
  const { role } = useDemoAuth();
  const dashboard = getRole(role)?.dashboardRoute ?? "/select-role";
  const segments = pathname.split("/").filter(Boolean);
  return <nav aria-label="Breadcrumb"><ol className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]"><li><Link href={dashboard} className="hover:text-[var(--primary)]" aria-label="Dashboard"><Home className="size-3.5" /></Link></li>{segments.map((segment, index) => { const last = index === segments.length - 1; const label = routeLabels[segment] ?? (last && segments.length > 1 ? "Record" : segment.replaceAll("-", " ")); const href = `/${segments.slice(0, index + 1).join("/")}`; return <li key={href} className="flex items-center gap-1.5"><ChevronRight className="size-3" />{last ? <span className="font-medium text-[var(--text)]">{label}</span> : <Link href={href} className="capitalize hover:text-[var(--primary)]">{label}</Link>}</li>; })}</ol></nav>;
}
