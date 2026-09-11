--------------------------------------------------------------------------------
-- Q18 - REPORT: INVESTIGATOR WORKLOAD
-- Trace: 06-reports/reports.ts (getInvestigatorWorkload) -> GET /api/integrity/reports/investigator-workload -> features/integrity/06-reports/integrity-reports.tsx
-- UI: /integrity/reports -> Investigator Workload (MANAGER)
-- Includes INVESTIGATOR-scope officers with zero unresolved assignments.
-- Concepts: V004 authorization scope, LEFT JOIN, ER aggregation traversal,
--           COUNT, COUNT(DISTINCT), GROUP BY
--
-- Aggregation path is intentionally visible:
-- INVESTIGATOR ADMIN
--   -> INVESTIGATES
--   -> INVOLVES_IN
--   -> PLAYER -> PERSON
--   -> CASE_RECORD
--------------------------------------------------------------------------------

SELECT
    a.person_id AS investigator_id,
    ap.first_name || ' ' || ap.last_name AS investigator,
    a.designation,
    a.department,
    COUNT(c.case_id) AS active_assignments,
    COUNT(DISTINCT c.case_id) AS active_cases
FROM integrity_officer_access ioa
JOIN admin a
  ON a.person_id = ioa.admin_id
 AND a.is_deleted = 0
JOIN person ap
  ON ap.person_id = a.person_id
 AND ap.is_deleted = 0
LEFT JOIN investigates i
  ON i.admin_id = a.person_id
 AND i.is_deleted = 0
LEFT JOIN involves_in ii
  ON ii.person_id = i.person_id
 AND ii.case_id = i.case_id
 AND ii.is_deleted = 0
LEFT JOIN player pl
  ON pl.person_id = ii.person_id
 AND pl.is_deleted = 0
LEFT JOIN person pp
  ON pp.person_id = pl.person_id
 AND pp.is_deleted = 0
LEFT JOIN case_record c
  ON c.case_id = ii.case_id
 AND c.is_deleted = 0
 AND c.status IN ('OPEN', 'UNDER_INVESTIGATION', 'REFERRED')
WHERE ioa.access_scope = 'INVESTIGATOR'
  AND ioa.is_deleted = 0
GROUP BY
    a.person_id,
    ap.first_name,
    ap.last_name,
    a.designation,
    a.department
ORDER BY active_assignments DESC, investigator, investigator_id
