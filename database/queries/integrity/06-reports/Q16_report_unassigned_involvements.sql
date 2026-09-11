--------------------------------------------------------------------------------
-- Q16 - REPORT: ACTIVE INVOLVEMENTS WITHOUT AN INVESTIGATOR
-- Trace: 06-reports/reports.ts (getUnassignedInvolvements) -> GET /api/integrity/reports/unassigned-involvements -> features/integrity/06-reports/integrity-reports.tsx
-- UI: /integrity/reports -> Investigation Monitoring (MANAGER)
-- Concepts: relationship traversal, correlated NOT EXISTS, IN, concatenation
--
-- Outer path identifies a valid PLAYER involvement in an active CASE_RECORD.
-- NOT EXISTS checks whether the aggregate INVESTIGATES relationship is missing.
--------------------------------------------------------------------------------

SELECT
    c.case_id,
    c.status,
    c.date_opened,
    pp.person_id AS player_id,
    pp.first_name || ' ' || pp.last_name AS player,
    pl.player_role
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
WHERE c.is_deleted = 0
  AND c.status IN ('OPEN', 'UNDER_INVESTIGATION', 'REFERRED')
  AND NOT EXISTS (
        SELECT 1
        FROM investigates i
        WHERE i.person_id = ii.person_id
          AND i.case_id = ii.case_id
          AND i.is_deleted = 0
      )
ORDER BY c.date_opened, c.case_id, player
