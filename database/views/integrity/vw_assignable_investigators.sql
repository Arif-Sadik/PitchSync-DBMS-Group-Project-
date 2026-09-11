--------------------------------------------------------------------------------
-- PitchSync
-- View: VW_ASSIGNABLE_INVESTIGATORS
--
-- Purpose:
-- Returns active Integrity Officers who are currently eligible to be assigned
-- as investigators, together with their current active assignment count.
--
-- Reuses:
--   FN_ACTIVE_ASSIGNMENT_COUNT
--------------------------------------------------------------------------------

CREATE OR REPLACE VIEW vw_assignable_investigators AS
SELECT
    a.person_id AS investigator_id,
    p.first_name || ' ' || p.last_name AS investigator_name,
    a.designation,
    a.department,
    fn_active_assignment_count(a.person_id) AS active_assignment_count
FROM integrity_officer_access ioa
JOIN admin a
    ON a.person_id = ioa.admin_id
JOIN person p
    ON p.person_id = a.person_id
WHERE ioa.access_scope = 'INVESTIGATOR'
  AND ioa.is_deleted = 0
  AND a.is_deleted = 0
  AND p.is_deleted = 0;
/
