import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { IntegrityCases } from "@/features/integrity/03-cases/integrity-cases";

export default function Page() {
  return <Suspense fallback={<LoadingState />}><IntegrityCases /></Suspense>;
}
