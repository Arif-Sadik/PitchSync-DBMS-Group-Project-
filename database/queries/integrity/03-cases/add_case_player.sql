--------------------------------------------------------------------------------
-- PitchSync - Add Player to Case
--
-- Re-activates or inserts an INVOLVES_IN relationship for a case-player pair.
--
-- INVOLVES_IN uses soft deletion: a previously removed relationship may still
-- exist with is_deleted = 1. The MERGE restores it instead of inserting a
-- duplicate that would violate the composite key (person_id, case_id).
--
-- Bind: :playerId, :caseId
--------------------------------------------------------------------------------

MERGE INTO involves_in target
USING (
    SELECT
        :playerId AS person_id,
        :caseId   AS case_id
    FROM dual
) source
ON (
    target.person_id = source.person_id
    AND target.case_id = source.case_id
)
WHEN MATCHED THEN
    UPDATE SET
        target.is_deleted = 0
WHEN NOT MATCHED THEN
    INSERT (
        person_id,
        case_id,
        is_deleted
    )
    VALUES (
        source.person_id,
        source.case_id,
        0
    )