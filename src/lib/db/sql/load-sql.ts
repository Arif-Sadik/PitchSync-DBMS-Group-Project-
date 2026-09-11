import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

const sqlCache = new Map<string, string>();

function safeRelativePath(relative: string): string {
  if (relative.includes("..") || relative.startsWith("/")) {
    throw new Error("Invalid SQL file path.");
  }

  if (!relative.endsWith(".sql")) {
    throw new Error("SQL files must use the .sql extension.");
  }

  return relative;
}

export async function loadSql(relativePath: string): Promise<string> {
  const normalized = safeRelativePath(relativePath);
  const cacheKey = normalized;

  if (sqlCache.has(cacheKey)) {
    return sqlCache.get(cacheKey)!;
  }

  const fullPath = join(
    process.cwd(),
    "database",
    "queries",
    normalized,
  );

  const sql = await readFile(fullPath, "utf-8");

  sqlCache.set(cacheKey, sql);

  return sql;
}
