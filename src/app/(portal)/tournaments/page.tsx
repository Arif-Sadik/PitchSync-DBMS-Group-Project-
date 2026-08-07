import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { TournamentManagement } from "@/features/tournaments/tournament-management";
export default function Page() { return <Suspense fallback={<LoadingState />}><TournamentManagement /></Suspense>; }
