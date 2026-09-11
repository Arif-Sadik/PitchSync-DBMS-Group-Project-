--------------------------------------------------------------------------------
-- PitchSync - Review Investigation Finding (Manager)
--
-- Only the review fields are updated. The Investigator's content
-- (conclusion, finding_description, recommendation, submitted_by_admin_id)
-- is never rewritten here; the Manager decides, not edits.
--
-- The Manager's identity (reviewed_by_admin_id) is the trusted session admin.
-- Application validation controls the dropdown-domain review status domain.
--
-- Bind: :playerId, :caseId, :reviewStatus, :reviewerId, :managerComment
--------------------------------------------------------------------------------

UPDATE investigation_finding
SET review_status = :reviewStatus,
    reviewed_by_admin_id = :reviewerId,
    reviewed_at = SYSTIMESTAMP,
    manager_comment = :managerComment
WHERE person_id = :playerId
  AND case_id = :caseId
  AND is_deleted = 0