--------------------------------------------------------------------------------
-- PitchSync - Remove Player from Case
--
-- Soft-deletes the INVOLVES_IN relationship for a case-player pair and, in the
-- same transaction, deactivates any INVESTIGATES assignment recorded for the
-- same player-case relationship. Both rows keep their primary keys and are
-- excluded from active data by is_deleted = 1.
--
-- Bind: :playerId, :caseId
--------------------------------------------------------------------------------

BEGIN
    UPDATE investigates
    SET is_deleted = 1
    WHERE case_id = :caseId
      AND person_id = :playerId;

    UPDATE involves_in
    SET is_deleted = 1
    WHERE case_id = :caseId
      AND person_id = :playerId;
END;