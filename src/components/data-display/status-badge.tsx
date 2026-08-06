import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: "Planned" | "Backend unavailable" | "Awaiting backend" }) {
  return <Badge variant={status === "Planned" ? "planned" : "unavailable"}>{status}</Badge>;
}
