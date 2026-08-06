export function DetailField({ label, value = "—" }: { label: string; value?: React.ReactNode }) {
  return <div><dt className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)]">{label}</dt><dd className="mt-1.5 min-h-5 text-sm font-medium text-[var(--text)]">{value}</dd></div>;
}
