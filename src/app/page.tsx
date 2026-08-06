"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRole } from "@/config/roles";
import { LoadingState } from "@/components/feedback/loading-state";
import { useDemoAuth } from "@/features/demo-auth";

export default function HomePage() {
  const auth = useDemoAuth();
  const router = useRouter();
  useEffect(() => { if (!auth.hydrated) return; const destination = auth.signedIn ? (getRole(auth.role)?.dashboardRoute ?? "/select-role") : "/sign-in"; router.replace(destination); }, [auth.hydrated, auth.role, auth.signedIn, router]);
  return <main className="grid min-h-screen place-items-center"><LoadingState title="Opening PitchSync" /></main>;
}
