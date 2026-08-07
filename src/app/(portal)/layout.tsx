import { AppShell } from "@/components/layout/app-shell";
import { DemoRouteGuard } from "@/features/demo-auth";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <DemoRouteGuard><AppShell>{children}</AppShell></DemoRouteGuard>;
}
