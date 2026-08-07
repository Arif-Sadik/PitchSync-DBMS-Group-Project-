import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: "No data available" | "Not available" }) {
  return <Badge variant="unavailable">{status}</Badge>;
}
