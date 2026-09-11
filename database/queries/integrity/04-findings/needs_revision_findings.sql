--------------------------------------------------------------------------------
-- INVESTIGATOR "NEEDS REVISION" FINDINGS
-- UI: /integrity/dashboard (INVESTIGATOR) - Needs Revision actionable list
-- Bind: :admin_id = logged-in investigator PERSON/ADMIN ID
-- Returns the investigator's findings the Manager asked to revise, including
-- the Manager comment so revision work can start from the dashboard.
-- Only MINIMAL joins: player name (PERSON). The Manager comment is already part
-- of the investigator-safe finding payload used by the findings workflow.
--------------------------------------------------------------------------------

SELECT
    f.case_id,
    f.person_id AS player_id,
    pp.first_name || ' ' || pp.last_name AS player_name,
    f.recommendation,
    f.submitted_at,
    f.review_status,
    f.manager_comment
FROM investigation_finding f
JOIN person pp
  ON pp.person_id = f.person_id
 AND pp.is_deleted = 0
WHERE f.submitted_by_admin_id = :admin_id
  AND f.review_status = 'REVISION_REQUESTED'
  AND f.is_deleted = 0
ORDER BY f.submitted_at DESC, f.case_id