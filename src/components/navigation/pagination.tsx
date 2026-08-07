import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination() {
  return <div className="flex items-center justify-between border-t bg-white px-4 py-3"><p className="text-xs text-[var(--text-muted)]">No records to paginate</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled aria-label="Previous page"><ChevronLeft />Previous</Button><Button variant="outline" size="sm" disabled aria-label="Next page">Next<ChevronRight /></Button></div></div>;
}
