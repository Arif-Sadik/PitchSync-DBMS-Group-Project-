import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { TeamManagement } from "@/features/teams/team-management";
export default function Page() { return <Suspense fallback={<LoadingState />}><TeamManagement /></Suspense>; }
