----------------
-- PitchSync
-- Procedure: PR_OPEN_INTEGRITY_CASE
--
-- Purpose:
-- Opens a new Integrity case with one initial involved player.
-- Optionally links a complaint and optionally assigns an investigator.
--
-- Reuses:
--   PR_ASSIGN_INVESTIGATOR
----------------

CREATE OR REPLACE PROCEDURE pr_open_integrity_case (
    p_complaint_id       IN NUMBER DEFAULT NULL,
    p_player_id          IN NUMBER,
    p_involvement_type   IN VARCHAR2,
    p_investigator_id    IN NUMBER DEFAULT NULL,
    p_case_id            OUT NUMBER
)
IS
    v_count NUMBER;

    e_invalid_complaint EXCEPTION;
BEGIN

    
    -- 1. Optional complaint must be active if supplied.
    --    FK proves existence, but cannot detect soft deletion.
    
    IF p_complaint_id IS NOT NULL THEN
        SELECT COUNT(*)
          INTO v_count
          FROM complaint
         WHERE complaint_id = p_complaint_id
           AND is_deleted = 0;

        IF v_count = 0 THEN
            RAISE e_invalid_complaint;
        END IF;
    END IF;


    
    -- 2. Create case.
    --    CASE_ID comes from the table default sequence.
    
    INSERT INTO case_record (
        involvement_type
    )
    VALUES (
        p_involvement_type
    )
    RETURNING case_id INTO p_case_id;


    
    -- 3. Link complaint only when case originated from one.
    
    IF p_complaint_id IS NOT NULL THEN
        INSERT INTO source_of (
            case_id,
            complaint_id
        )
        VALUES (
            p_case_id,
            p_complaint_id
        );
    END IF;


    
    -- 4. Add the initial involved player.
    --    PLAYER and CASE validity are already enforced by FKs.
    
    INSERT INTO involves_in (
        person_id,
        case_id
    )
    VALUES (
        p_player_id,
        p_case_id
    );


    
    -- 5. Optional investigator assignment.
    --    Reuse the existing assignment procedure.
    
    IF p_investigator_id IS NOT NULL THEN
        pr_assign_investigator(
            p_case_id         => p_case_id,
            p_player_id       => p_player_id,
            p_investigator_id => p_investigator_id
        );
    END IF;


EXCEPTION
    WHEN e_invalid_complaint THEN
        RAISE_APPLICATION_ERROR(
            -20010,
            'The selected complaint is not available for case creation.'
        );
END;
/