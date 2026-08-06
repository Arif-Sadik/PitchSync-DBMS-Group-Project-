import { getRole } from "@/config/roles";
import type { RoleId } from "@/features/demo-auth/types";
import { Badge } from "@/components/ui/badge";

export function RoleBadge({ roleId }: { roleId: RoleId }) {
  const role = getRole(roleId);
  return <Badge>{role?.label ?? "Role"}</Badge>;
}
