--------------------------------------------------------------------------------
-- Q09 - CASE DETAILS: INVESTIGATION TEAM
-- Trace: 03-cases/case-details.ts (findCaseById) -> GET /api/integrity/cases/[caseId] (Manager-only roster) -> 03-cases/manager-case-details.tsx
-- UI: /integrity/cases/[caseId] -> Investigation Team tab
-- Bind: :case_id
-- Concepts: ER aggregation traversal, JOIN, GROUP BY, COUNT, ORDER BY
--
-- The complete aggregation path is intentionally retained for explanation:
-- CASE_RECORD -> INVOLVES_IN -> PLAYER -> PERSON
--                         -> INVESTIGATES -> ADMIN -> PERSON
--------------------------------------------------------------------------------

SELECT
    a.person_id AS investigator_id,
    ap.first_name || ' ' || ap.last_name AS investigator,
    a.designation,
    a.department,
    ioa.access_scope,
    COUNT(ii.person_id) AS assigned_players
FROM case_record c
JOIN involves_in ii
  ON ii.case_id = c.case_id
 AND ii.is_deleted = 0
JOIN player pl
  ON pl.person_id = ii.person_id
 AND pl.is_deleted = 0
JOIN person pp
  ON pp.person_id = pl.person_id
 AND pp.is_deleted = 0
JOIN investigates i
  ON i.person_id = ii.person_id
 AND i.case_id = ii.case_id
 AND i.is_deleted = 0
JOIN admin a
  ON a.person_id = i.admin_id
 AND a.is_deleted = 0
JOIN person ap
  ON ap.person_id = a.person_id
 AND ap.is_deleted = 0
LEFT JOIN integrity_officer_access ioa
  ON ioa.admin_id = a.person_id
 AND ioa.is_deleted = 0
WHERE c.case_id = :case_id
  AND c.is_deleted = 0
GROUP BY
    a.person_id,
    ap.first_name,
    ap.last_name,
    a.designation,
    a.department,
    ioa.access_scope
ORDER BY investigator, investigator_id
