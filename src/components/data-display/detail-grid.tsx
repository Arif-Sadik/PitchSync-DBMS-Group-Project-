import { cn } from "@/lib/utils";

export function DetailGrid({ children, columns = 3 }: { children: React.ReactNode; columns?: 2 | 3 | 4 }) {
  return <dl className={cn("grid gap-x-8 gap-y-6", columns === 2 && "grid-cols-2", columns === 3 && "grid-cols-3", columns === 4 && "grid-cols-4")}>{children}</dl>;
}
