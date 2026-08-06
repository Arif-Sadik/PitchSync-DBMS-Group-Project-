"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { canAccessRoute } from "@/config/route-access";
import { getRole } from "@/config/roles";
import { LoadingState } from "@/components/feedback/loading-state";
import { useDemoAuth } from "./demo-auth-provider";

export function DemoRouteGuard({ children }: { children: React.ReactNode }) {
  const auth = useDemoAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!auth.hydrated || process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === "false") return;
    if (!auth.signedIn) router.replace("/sign-in");
    else if (!auth.role) router.replace("/select-role");
    else if (!canAccessRoute(auth.role, pathname)) router.replace(getRole(auth.role)?.dashboardRoute ?? "/select-role");
  }, [auth.hydrated, auth.role, auth.signedIn, pathname, router]);

  if (!auth.hydrated || (process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH !== "false" && (!auth.signedIn || !auth.role))) {
    return <div className="grid min-h-screen place-items-center"><LoadingState title="Preparing workspace" /></div>;
  }
  return children;
}
