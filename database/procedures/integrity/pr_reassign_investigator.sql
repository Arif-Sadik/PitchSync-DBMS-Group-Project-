--------------------------------------------------------------------------------
-- PitchSync
-- Procedure: PR_BULK_REASSIGN_INVESTIGATOR
--
-- Purpose:
-- Transfers all active investigation assignments from one investigator
-- to another eligible investigator.
--
-- Active assignment:
--   - INVESTIGATES row is active
--   - CASE_RECORD row is active
--   - Case is not CLOSED
--
-- Reuses:
--   PR_ASSIGN_INVESTIGATOR
--
-- Cursor:
--   Iterates through each active player-case assignment belonging to
--   the old investigator.
--------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE pr_reassign_investigator (
    p_old_investigator_id  IN NUMBER,
    p_new_investigator_id  IN NUMBER,
    p_reassigned_count     OUT NUMBER
)
IS
   ---cursor
    CURSOR c_active_assignments IS
        SELECT
            i.person_id,
            i.case_id
        FROM investigates i
        JOIN case_record c
          ON c.case_id = i.case_id
        WHERE i.admin_id = p_old_investigator_id
          AND i.is_deleted = 0
          AND c.is_deleted = 0
          AND c.status <> 'CLOSED'
        ORDER BY
            i.case_id,
            i.person_id;

    v_reassigned_count NUMBER := 0;

BEGIN
   
    FOR r_assignment IN c_active_assignments LOOP

        pr_assign_investigator(
            p_case_id         => r_assignment.case_id,
            p_player_id       => r_assignment.person_id,
            p_investigator_id => p_new_investigator_id
        );

        v_reassigned_count := v_reassigned_count + 1;

    END LOOP;

    p_reassigned_count := v_reassigned_count;

END;
/