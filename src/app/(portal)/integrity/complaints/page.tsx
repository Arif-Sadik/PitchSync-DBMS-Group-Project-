import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { ComplaintRegistry } from "@/features/integrity/02-complaints/complaint-registry";
export default function Page() { return <Suspense fallback={<LoadingState />}><ComplaintRegistry /></Suspense>; }
