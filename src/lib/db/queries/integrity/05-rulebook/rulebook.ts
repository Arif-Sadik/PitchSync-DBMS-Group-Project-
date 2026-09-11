import "server-only";

import type {
  RulebookListItem,
  RulebookRecord,
} from "@/data/contracts";
import {
  queryRows,
  type BindParameters,
  type Connection,
} from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

export type RulebookListFilters = {
  page: number;
  pageSize: number;
  q?: string;
  category?: string;
  sort?: "clause" | "id" | "category";
};

type CountRow = { TOTAL_ITEMS: number };

type RuleDetailRow = {
  RULE_ID: number;
  CLAUSE_NUMBER: string;
  CATEGORY: string;
  CASE_ID: number | null;
  CASE_STATUS: string | null;
  CASE_DATE_OPENED: string | null;
  INVOLVEMENT_TYPE: string | null;
};

function buildRulebookBinds(
  filters: RulebookListFilters,
): BindParameters {
  return {
    q: filters.q?.trim() || null,
    category: filters.category?.trim() || null,
  };
}

export async function listRules(
  connection: Connection,
  filters: RulebookListFilters,
) {
  const binds = buildRulebookBinds(filters);

  const countRows = await queryRows<CountRow>(
    connection,
    "SELECT COUNT(*) AS total_items FROM rulebook r WHERE r.is_deleted = 0",
  );

  const sql = await loadSql(
    "integrity/05-rulebook/Q13_rulebook_registry.sql",
  );

  const rows = await queryRows<{
    RULE_ID: number;
    CLAUSE_NUMBER: string;
    CATEGORY: string;
    LINKED_CASES: number;
  }>(connection, sql, {
    ...binds,
    rowOffset: (filters.page - 1) * filters.pageSize,
    rowLimit: filters.pageSize,
  });

  const data: readonly RulebookListItem[] = rows.map(
    (row) => ({
      ruleId: String(row.RULE_ID),
      clauseNumber: row.CLAUSE_NUMBER,
      category: row.CATEGORY,
      linkedCaseCount: Number(row.LINKED_CASES),
    }),
  );

  return {
    data,
    totalItems: Number(countRows[0]?.TOTAL_ITEMS ?? 0),
  };
}

export async function findRuleById(
  connection: Connection,
  ruleId: number,
): Promise<RulebookRecord | null> {
  const sql = await loadSql(
    "integrity/05-rulebook/Q14_rulebook_details.sql",
  );

  const rows = await queryRows<RuleDetailRow>(
    connection,
    sql,
    { rule_id: ruleId },
  );

  const first = rows[0];
  if (!first) return null;

  const linkedCases = rows
    .filter((row) => row.CASE_ID !== null)
    .map((row) => ({
      caseId: String(row.CASE_ID),
      status: row.CASE_STATUS ?? "",
      dateOpened: row.CASE_DATE_OPENED ?? "",
      referralStatus: undefined,
      involvedPlayerCount: 0,
    }));

  return {
    ruleId: String(first.RULE_ID),
    clauseNumber: first.CLAUSE_NUMBER,
    category: first.CATEGORY,
    caseIds: linkedCases.map((record) => record.caseId),
    linkedCases,
  };
}
