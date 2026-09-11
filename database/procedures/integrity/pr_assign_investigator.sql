--------------------------------------------------------------------------------
-- PitchSync
-- Procedure: PR_ASSIGN_INVESTIGATOR
--------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE pr_assign_investigator (
    p_case_id          IN NUMBER,
    p_player_id        IN NUMBER,
    p_investigator_id  IN NUMBER
)
IS
    v_count NUMBER;

    e_invalid_involvement EXCEPTION;
    e_invalid_investigator EXCEPTION;

BEGIN
    -- 1. Active player-case involvement must exist
    SELECT COUNT(*)
      INTO v_count
      FROM involves_in ii
      JOIN case_record c
        ON c.case_id = ii.case_id
     WHERE ii.person_id = p_player_id
       AND ii.case_id = p_case_id
       AND ii.is_deleted = 0
       AND c.is_deleted = 0
       AND c.status <> 'CLOSED';

    IF v_count = 0 THEN
        RAISE e_invalid_involvement;
    END IF;

    -- 2. Selected officer must be currently assignable
    SELECT COUNT(*)
      INTO v_count
      FROM vw_assignable_investigators
     WHERE investigator_id = p_investigator_id;

    IF v_count = 0 THEN
        RAISE e_invalid_investigator;
    END IF;

    -- 3. Assign / reassign investigator
    MERGE INTO investigates target
    USING (
        SELECT
            p_player_id       AS person_id,
            p_case_id         AS case_id,
            p_investigator_id AS admin_id
        FROM dual
    ) source
    ON (
        target.person_id = source.person_id
        AND target.case_id = source.case_id
    )

    WHEN MATCHED THEN
        UPDATE SET
            target.admin_id = source.admin_id,
            target.is_deleted = 0

    WHEN NOT MATCHED THEN
        INSERT (
            person_id,
            case_id,
            admin_id,
            is_deleted
        )
        VALUES (
            source.person_id,
            source.case_id,
            source.admin_id,
            0
        );

    -- 4. Start the investigation on first assignment.
    --    A newly assigned OPEN case transitions to UNDER_INVESTIGATION.
    --    Reassignment on an already-started case leaves status unchanged.
    UPDATE case_record
       SET status = 'UNDER_INVESTIGATION'
     WHERE case_id = p_case_id
       AND status = 'OPEN'
       AND is_deleted = 0;

EXCEPTION
    WHEN e_invalid_involvement THEN
        RAISE_APPLICATION_ERROR(
            -20001,
            'The involvement is not available for investigator assignment.'
        );

    WHEN e_invalid_investigator THEN
        RAISE_APPLICATION_ERROR(
            -20002,
            'The selected officer is not an assignable investigator.'
        );
END;
/