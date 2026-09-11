import "server-only";

import { queryRows, type Connection } from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

type DashboardMetricsRow = {
  TOTAL_COMPLAINTS: number;
  UNRESOLVED_CASES: number;
  INVESTIGATOR_OFFICERS: number;
  EVIDENCE_ITEMS: number;
};

export type IntegrityDashboardMetrics = {
  totalComplaints: number;
  unresolvedCases: number;
  investigatorOfficers: number;
  evidenceItems: number;
};

export async function getManagerDashboardMetrics(
  connection: Connection,
): Promise<IntegrityDashboardMetrics> {
  const sql = await loadSql(
    "integrity/01-dashboard/Q01_manager_dashboard_metrics.sql",
  );

  const rows = await queryRows<DashboardMetricsRow>(
    connection,
    sql,
  );

  const row = rows[0];

  return {
    totalComplaints: Number(row?.TOTAL_COMPLAINTS ?? 0),
    unresolvedCases: Number(row?.UNRESOLVED_CASES ?? 0),
    investigatorOfficers: Number(
      row?.INVESTIGATOR_OFFICERS ?? 0,
    ),
    evidenceItems: Number(row?.EVIDENCE_ITEMS ?? 0),
  };
}
