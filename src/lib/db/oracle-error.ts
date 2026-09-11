import "server-only";

export function oracleErrorNumber(
  error: unknown,
): number | null {
  if (error && typeof error === "object") {
    const candidate = (error as { errorNum?: unknown }).errorNum;
    if (typeof candidate === "number") return candidate;
  }

  if (error instanceof Error) {
    const match = /ORA-(\d+)/.exec(error.message);
    if (match) return -Number(match[1]);
  }

  return null;
}
