"use client";

import { DataStateView } from "@/components/feedback/data-state-view";
import { useDemoDataState } from "@/hooks/use-demo-data-state";
import type { DataStatus } from "@/types/data-state";

export function StatePanel({ fallback = "empty", title = "No records available", message, compact = true }: { fallback?: DataStatus; title?: string; message?: string; compact?: boolean }) {
  const state = useDemoDataState<readonly never[]>([], fallback, message ?? "No information is available for this view.");
  return <DataStateView state={state} emptyTitle={title} compact={compact}>{() => null}</DataStateView>;
}
