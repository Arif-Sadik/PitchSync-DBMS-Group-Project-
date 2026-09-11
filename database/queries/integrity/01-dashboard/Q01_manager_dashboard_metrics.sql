--------------------------------------------------------------------------------
-- Q01 - MANAGER DASHBOARD METRICS
-- Trace: dashboard.ts (integrityDashboard) + 01-dashboard/metrics.ts (getManagerDashboardMetrics) -> GET /api/dashboard -> features/integrity/01-dashboard/integrity-dashboard.tsx
-- UI: /integrity/dashboard (MANAGER)
-- Returns one row.
-- Concepts: scalar subqueries, COUNT
-- Purpose: concise department-wide metrics for the Integrity Manager.
--------------------------------------------------------------------------------

SELECT
    (SELECT COUNT(*)
       FROM complaint comp
      WHERE comp.is_deleted = 0) AS total_complaints,

    (SELECT COUNT(*)
       FROM case_record c
      WHERE c.is_deleted = 0
        AND c.status IN ('OPEN', 'UNDER_INVESTIGATION', 'REFERRED'))
        AS unresolved_cases,

    (SELECT COUNT(*)
       FROM integrity_officer_access ioa
       JOIN admin a
         ON a.person_id = ioa.admin_id
        AND a.is_deleted = 0
       JOIN person p
         ON p.person_id = a.person_id
        AND p.is_deleted = 0
      WHERE ioa.access_scope = 'INVESTIGATOR'
        AND ioa.is_deleted = 0) AS investigator_officers,

    (SELECT COUNT(*)
       FROM case_record c
       JOIN evidence e
         ON e.case_id = c.case_id
        AND e.is_deleted = 0
      WHERE c.is_deleted = 0) AS evidence_items
FROM dual
