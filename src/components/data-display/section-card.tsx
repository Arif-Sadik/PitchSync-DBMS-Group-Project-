import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SectionCard({ title, description, icon: Icon, action, children, className, contentClassName }: { title: string; description?: string; icon?: LucideIcon; action?: React.ReactNode; children: React.ReactNode; className?: string; contentClassName?: string }) {
  return <Card className={className}><CardHeader className="flex-row items-start justify-between gap-4"><div className="flex gap-3">{Icon ? <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--primary-soft)]"><Icon className="size-4 text-[var(--primary)]" /></div> : null}<div><CardTitle>{title}</CardTitle>{description ? <CardDescription className="mt-1">{description}</CardDescription> : null}</div></div>{action}</CardHeader><CardContent className={cn("pt-0", contentClassName)}>{children}</CardContent></Card>;
}
