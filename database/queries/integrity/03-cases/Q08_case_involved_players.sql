--------------------------------------------------------------------------------
-- Q08 - CASE DETAILS: INVOLVED PLAYERS
-- Trace: 03-cases/case-details.ts (findCaseById) -> GET /api/integrity/cases/[caseId] | GET /api/integrity/my-cases/[caseId] -> 03-cases/manager-case-details.tsx | 03-cases/investigator-case-details.tsx
-- UI: /integrity/cases/[caseId] -> Involved Players tab
-- Bind: :case_id
-- Concepts: relationship traversal, multiple JOIN ... ON, LEFT JOIN, NVL
--
-- Aggregation is shown naturally:
-- CASE_RECORD -> INVOLVES_IN -> PLAYER -> PERSON
--                         -> INVESTIGATES -> ADMIN -> PERSON
-- INVESTIGATES is optional because a valid involvement may still be unassigned.
--------------------------------------------------------------------------------

SELECT
    pp.person_id AS player_id,
    pp.first_name || ' ' || pp.last_name AS player,
    pl.player_role,
    c.involvement_type,
    a.person_id AS investigator_id,
    NVL(ap.first_name || ' ' || ap.last_name, 'Unassigned')
        AS assigned_investigator
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
LEFT JOIN investigates i
  ON i.person_id = ii.person_id
 AND i.case_id = ii.case_id
 AND i.is_deleted = 0
LEFT JOIN admin a
  ON a.person_id = i.admin_id
 AND a.is_deleted = 0
LEFT JOIN person ap
  ON ap.person_id = a.person_id
 AND ap.is_deleted = 0
WHERE c.case_id = :case_id
  AND c.is_deleted = 0
ORDER BY pp.first_name, pp.last_name, pp.person_id
