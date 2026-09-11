export function formatCaseLabel(value: string | null | undefined): string {
  if (!value) return "—";

  return value.replaceAll("_", " ");
}