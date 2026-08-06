import { CircleAlert } from "lucide-react";

export function ValidationSummary({ errors }: { errors: readonly string[] }) {
  if (errors.length === 0) return null;
  return <div className="rounded-xl border border-[#efcece] bg-[#faeeee] p-4" role="alert"><div className="flex gap-3"><CircleAlert className="mt-0.5 size-5 shrink-0 text-[var(--danger)]" /><div><p className="text-sm font-semibold text-[var(--danger)]">Review the highlighted fields</p><ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-[#7e3c3c]">{errors.map((error) => <li key={error}>{error}</li>)}</ul></div></div></div>;
}
