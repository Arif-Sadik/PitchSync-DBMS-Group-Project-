--------------------------------------------------------------------------------
-- PitchSync
-- Function: FN_ACTIVE_ASSIGNMENT_COUNT
--
-- Purpose:
-- Returns the number of active investigation assignments currently assigned
-- to one investigator.
--
-- Active assignment means:
--   - INVESTIGATES row is not soft-deleted
--   - CASE_RECORD row is not soft-deleted
--   - Case status is OPEN, UNDER_INVESTIGATION, or REFERRED
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_active_assignment_count (
    p_investigator_id IN NUMBER
)
RETURN NUMBER
IS
    v_assignment_count NUMBER;
BEGIN

    SELECT COUNT(*)
      INTO v_assignment_count
      FROM investigates i
      JOIN case_record c
        ON c.case_id = i.case_id
     WHERE i.admin_id = p_investigator_id
       AND i.is_deleted = 0
       AND c.is_deleted = 0
       AND c.status IN (
           'OPEN',
           'UNDER_INVESTIGATION',
           'REFERRED'
       );

    RETURN v_assignment_count;

END;
/