import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/feedback/empty-state";

export function DataTableShell({ columns, emptyTitle = "No records available", emptyDescription = "No records are available because the database service is not connected.", minWidth = 760 }: { columns: readonly string[]; emptyTitle?: string; emptyDescription?: string; minWidth?: number }) {
  return <div className="overflow-hidden rounded-xl border bg-white"><Table style={{ minWidth }}><TableHeader><TableRow>{columns.map((column) => <TableHead key={column}>{column}</TableHead>)}</TableRow></TableHeader><TableBody><TableRow><TableCell colSpan={columns.length} className="p-0"><EmptyState compact title={emptyTitle} description={emptyDescription} /></TableCell></TableRow></TableBody></Table></div>;
}
