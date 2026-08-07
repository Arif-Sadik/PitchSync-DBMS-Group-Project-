import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { ComplaintRegistry } from "@/features/integrity/complaint-registry";
export default function Page() { return <Suspense fallback={<LoadingState />}><ComplaintRegistry /></Suspense>; }
