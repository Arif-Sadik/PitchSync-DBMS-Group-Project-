import type { RoleDefinition } from "@/config/roles";
import { navigationByRole } from "@/config/navigation";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNavigation } from "./sidebar-navigation";

export function Sidebar({ role }: { role: RoleDefinition }) {
  return <aside className="fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col bg-[linear-gradient(180deg,var(--bd-green-deep),var(--bd-green-darker))] text-[var(--sidebar-text)]"><SidebarHeader subtitle={role.shortLabel} /><SidebarNavigation items={navigationByRole[role.id]} /><SidebarFooter /></aside>;
}
