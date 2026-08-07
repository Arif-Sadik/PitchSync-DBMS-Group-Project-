import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { PlayerRegistry } from "@/features/players/player-registry";
export default function Page() { return <Suspense fallback={<LoadingState />}><PlayerRegistry /></Suspense>; }
