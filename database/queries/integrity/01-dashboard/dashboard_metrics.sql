--------------------------------------------------------------------------------
-- INVESTIGATOR DASHBOARD METRICS
-- UI: /integrity/dashboard (INVESTIGATOR)
-- Bind: :admin_id = logged-in investigator PERSON/ADMIN ID
-- Returns one row of personal metrics for the logged-in investigator.
--
-- Personal, assignment-scoped metrics:
--   active_cases        = distinct cases where this investigator has an active
--                         INVESTIGATES assignment and the case is not closed
--   active_assignments  = number of active INVESTIGATES assignments
--                         (one per assigned player-case involvement)
--   closed_cases        = distinct cases where this investigator has (or had)
--                         an assignment and the case is closed
--
-- INVESTIGATES operates at the player-case involvement level, so a single case
-- with two player involvements assigned to the same investigator counts as two
-- active assignments but one active case.
--------------------------------------------------------------------------------

SELECT
    (SELECT COUNT(DISTINCT i.case_id)
       FROM investigates i
       JOIN case_record c
         ON c.case_id = i.case_id
        AND c.is_deleted = 0
      WHERE i.admin_id = :admin_id
        AND i.is_deleted = 0
        AND c.status <> 'CLOSED')
        AS active_cases,

    (SELECT COUNT(*)
       FROM investigates i
       JOIN case_record c
         ON c.case_id = i.case_id
        AND c.is_deleted = 0
      WHERE i.admin_id = :admin_id
        AND i.is_deleted = 0
        AND c.status <> 'CLOSED')
        AS active_assignments,

    (SELECT COUNT(DISTINCT i.case_id)
       FROM investigates i
       JOIN case_record c
         ON c.case_id = i.case_id
        AND c.is_deleted = 0
      WHERE i.admin_id = :admin_id
        AND i.is_deleted = 0
        AND c.status = 'CLOSED')
        AS closed_cases
FROM dual