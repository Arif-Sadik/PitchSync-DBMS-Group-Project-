--------------------------------------------------------------------------------
-- INVESTIGATOR FINDING REVIEW METRICS
-- UI: /integrity/dashboard (INVESTIGATOR)
-- Bind: :admin_id = logged-in investigator PERSON/ADMIN ID
-- Returns one row with the investigator's personal finding review-state counts:
--   pending_review_count      = findings awaiting Manager review
--   revision_requested_count  = findings the Manager asked to revise
-- Assigned-work metrics remain the responsibility of dashboard_metrics.sql
-- (INVESTIGATES-based, FN_ACTIVE_ASSIGNMENT_COUNT semantics); this file is
-- finding-specific only and never duplicates assignment logic.
--------------------------------------------------------------------------------

SELECT
    (SELECT COUNT(*)
       FROM investigation_finding f
      WHERE f.submitted_by_admin_id = :admin_id
        AND f.review_status = 'PENDING'
        AND f.is_deleted = 0)
        AS pending_review_count,
    (SELECT COUNT(*)
       FROM investigation_finding f
      WHERE f.submitted_by_admin_id = :admin_id
        AND f.review_status = 'REVISION_REQUESTED'
        AND f.is_deleted = 0)
        AS revision_requested_count
FROM dual