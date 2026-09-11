--------------------------------------------------------------------------------
-- PitchSync - Upsert Investigation Finding
--
-- One current finding belongs to one player-case involvement, so identity is
-- (person_id, case_id):
--   no row    -> INSERT (first submission)
--   row exists-> UPDATE (revision/resubmission) resetting the review state so
--                the finding returns to PENDING for Manager review.
--
-- The Investigator's involvement-level assignment check happens in the API
-- layer before this runs, so submitted_by_admin_id is the trusted session
-- admin, not client input. History/versioning is left to later audit triggers.
--
-- Bind: :playerId, :caseId, :adminId, :conclusion, :description,
--       :recommendation
--------------------------------------------------------------------------------

MERGE INTO investigation_finding target
USING (
    SELECT
        :playerId AS person_id,
        :caseId AS case_id
    FROM dual
) source
ON (target.person_id = source.person_id
    AND target.case_id = source.case_id)

WHEN MATCHED THEN
    UPDATE SET
        conclusion = :conclusion,
        finding_description = :description,
        recommendation = :recommendation,
        submitted_at = SYSTIMESTAMP,
        review_status = 'PENDING',
        reviewed_by_admin_id = NULL,
        reviewed_at = NULL,
        manager_comment = NULL,
        is_deleted = 0

WHEN NOT MATCHED THEN
    INSERT (
        person_id,
        case_id,
        submitted_by_admin_id,
        conclusion,
        finding_description,
        recommendation,
        submitted_at,
        review_status,
        reviewed_by_admin_id,
        reviewed_at,
        manager_comment,
        is_deleted
    )
    VALUES (
        source.person_id,
        source.case_id,
        :adminId,
        :conclusion,
        :description,
        :recommendation,
        SYSTIMESTAMP,
        'PENDING',
        NULL,
        NULL,
        NULL,
        0
    )