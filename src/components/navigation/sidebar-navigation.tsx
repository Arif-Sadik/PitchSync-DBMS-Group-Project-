"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { NavigationItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function SidebarNavigation({ items }: { items: readonly NavigationItem[] }) {
  const pathname = usePathname();
  return <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Primary navigation"><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Workspace</p><ul className="space-y-1">{items.map((item) => { const Icon = item.icon; const active = item.href ? pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)) : false; const content = <span className={cn("flex h-10 w-full items-center gap-3 rounded-[9px] px-3 text-sm font-medium transition-colors", item.planned ? "cursor-not-allowed text-white/35" : active ? "bg-white/12 text-white shadow-[inset_3px_0_var(--primary)]" : "text-white/67 hover:bg-white/7 hover:text-white")}><Icon className="size-[18px] shrink-0" /><span className="min-w-0 flex-1 truncate text-left">{item.label}</span>{item.planned ? <Badge variant="planned" className="border-white/10 bg-white/8 px-1.5 py-0.5 text-[9px] text-white/55">Planned</Badge> : null}</span>;
    return <li key={item.label}>{item.planned ? <Tooltip><TooltipTrigger asChild><span className="block" tabIndex={0} aria-label={`${item.label}, planned feature`}><button className="w-full" type="button" disabled>{content}</button></span></TooltipTrigger><TooltipContent>This feature is planned for a later milestone.</TooltipContent></Tooltip> : <Link href={item.href ?? "/"}>{content}</Link>}</li>;
  })}</ul></nav>;
}

export const SidebarNav = SidebarNavigation;
