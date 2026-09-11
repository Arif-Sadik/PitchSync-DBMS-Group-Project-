"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingState } from "@/components/feedback/loading-state";
import { canAccessRoute } from "@/config/route-access";
import { getRole } from "@/config/roles";
import { useAuth } from "./auth-provider";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { hydrated, signedIn, role, session } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const integrityScope = session?.integrityScope;
  useEffect(() => {
    if (!hydrated) return;
    if (!signedIn || !role) router.replace("/sign-in");
    else if (!canAccessRoute(role, pathname, integrityScope)) router.replace(getRole(role)?.dashboardRoute ?? "/sign-in");
  }, [hydrated, role, signedIn, pathname, router, integrityScope]);
  if (!hydrated || !signedIn || !role || !canAccessRoute(role, pathname, integrityScope)) return <div className="grid min-h-screen place-items-center"><LoadingState title="Preparing workspace" /></div>;
  return children;
}
