--------------------------------------------------------------------------------
-- FF-01 - CASE DETAILS: FINDINGS
-- UI: /integrity/cases/[caseId] -> Findings tab (Manager)
--      /integrity/cases/[caseId] -> Finding tab (Investigator, own assignments)
-- Bind: :case_id
-- Concepts: INVESTIGATION_FINDING natural joins to PERSON for the involved
--           player and the submitting investigator, plus an optional PERSON
--           join for the reviewing Manager (review may still be pending).
--
-- Only active findings are returned. Projection is shared by both roles; each
-- role's API layer applies its own server-side filtering before it reaches UI.
--------------------------------------------------------------------------------

SELECT
    f.person_id AS player_id,
    pp.first_name || ' ' || pp.last_name AS player_name,
    f.submitted_by_admin_id,
    sap.first_name || ' ' || sap.last_name AS investigator_name,
    f.conclusion,
    f.finding_description,
    f.recommendation,
    f.submitted_at,
    f.review_status,
    f.reviewed_by_admin_id,
    CASE
        WHEN f.reviewed_by_admin_id IS NULL THEN NULL
        ELSE rap.first_name || ' ' || rap.last_name
    END AS reviewer_name,
    f.reviewed_at,
    f.manager_comment
FROM investigation_finding f
JOIN person pp
  ON pp.person_id = f.person_id
 AND pp.is_deleted = 0
JOIN admin sa
  ON sa.person_id = f.submitted_by_admin_id
 AND sa.is_deleted = 0
JOIN person sap
  ON sap.person_id = sa.person_id
 AND sap.is_deleted = 0
LEFT JOIN admin ra
  ON ra.person_id = f.reviewed_by_admin_id
 AND ra.is_deleted = 0
LEFT JOIN person rap
  ON rap.person_id = ra.person_id
 AND rap.is_deleted = 0
WHERE f.case_id = :case_id
  AND f.is_deleted = 0
ORDER BY pp.first_name, pp.last_name, pp.person_id