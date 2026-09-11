--------------------------------------------------------------------------------
-- Q02 - MY ASSIGNED CASES
-- Trace: reference only (no runtime caller) - investor "My Cases" runtime uses 03-cases/my_assigned_involvements.sql via 03-cases/assigned-cases.ts (getMyAssignedCases) -> GET /api/integrity/my-cases -> features/integrity/03-cases/investigator-cases.tsx
-- UI: /integrity/dashboard or /integrity/cases (INVESTIGATOR)
-- Bind: :admin_id = logged-in investigator PERSON/ADMIN ID
-- Concepts: aggregation relationship traversal, JOIN ... ON, GROUP BY, COUNT
--
-- Aggregation path intentionally kept explicit for DBMS demonstration:
-- CASE_RECORD -> INVOLVES_IN -> PLAYER -> PERSON
--                         -> INVESTIGATES -> ADMIN -> PERSON
--------------------------------------------------------------------------------

SELECT
    c.case_id,
    c.status,
    c.date_opened,
    c.involvement_type,
    c.referral_status,
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
JOIN integrity_officer_access ioa
  ON ioa.admin_id = a.person_id
 AND ioa.access_scope = 'INVESTIGATOR'
 AND ioa.is_deleted = 0
WHERE c.is_deleted = 0
  AND i.admin_id = :admin_id
GROUP BY
    c.case_id,
    c.status,
    c.date_opened,
    c.involvement_type,
    c.referral_status
ORDER BY c.date_opened DESC, c.case_id DESC
