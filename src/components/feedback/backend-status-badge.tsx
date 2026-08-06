import { WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BackendStatusBadge({ label = "Backend unavailable" }: { label?: string }) {
  return <Badge variant="unavailable"><WifiOff className="size-3" />{label}</Badge>;
}
