--------------------------------------------------------------------------------
-- MANAGER PENDING FINDING REVIEWS
-- UI: /integrity/dashboard (MANAGER) - "Pending Finding Reviews" summary
-- Read-only snapshot of INVESTIGATION_FINDING rows awaiting Manager review.
-- Supports both the Manager pending-scan count and the pending review list.
-- Only MINIMAL joins are used: player name (PERSON) and investigator name
-- (ADMIN + PERSON). No case-detail tables are joined - relationship details
-- live in the case details views (Q07-Q12).
--------------------------------------------------------------------------------

SELECT
    f.case_id,
    f.person_id AS player_id,
    pp.first_name || ' ' || pp.last_name AS player_name,
    f.submitted_by_admin_id,
    ap.first_name || ' ' || ap.last_name AS investigator_name,
    f.recommendation,
    f.submitted_at,
    f.review_status
FROM investigation_finding f
JOIN person pp
  ON pp.person_id = f.person_id
 AND pp.is_deleted = 0
JOIN admin a
  ON a.person_id = f.submitted_by_admin_id
 AND a.is_deleted = 0
JOIN person ap
  ON ap.person_id = a.person_id
 AND ap.is_deleted = 0
WHERE f.is_deleted = 0
  AND f.review_status = 'PENDING'
ORDER BY f.submitted_at DESC, f.case_id, f.person_id