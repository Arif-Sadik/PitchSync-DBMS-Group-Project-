--------------------------------------------------------------------------------
-- MY ASSIGNED INVOLVEMENTS (assignment-aware)
-- UI: /integrity/cases, /integrity/dashboard (INVESTIGATOR)
-- Bind: :admin_id = logged-in investigator PERSON/ADMIN ID
--
-- Purpose:
-- Q02 provides a per-CASE aggregate (with an ASSIGNED_PLAYERS count) but cannot
-- expose the assigned player's identity for a per-assignment row. INVESTIGATES
-- operates at the player-case involvement level, so this query returns ONE ROW
-- PER INVESTIGATES ASSIGNMENT for the logged-in investigator. A single case
-- with two player involvements assigned to the same investigator therefore
-- yields two rows (which the UI may group by case_id).
--
-- Columns:
--   case_id, status, date_opened, involvement_type, referral_status,
--   assigned_player_id, assigned_player_name, player_role
--------------------------------------------------------------------------------

SELECT
    c.case_id,
    c.status,
    c.date_opened,
    c.involvement_type,
    c.referral_status,
    pp.person_id AS assigned_player_id,
    pp.first_name || ' ' || pp.last_name AS assigned_player_name,
    pl.player_role
FROM investigates i
JOIN case_record c
  ON c.case_id = i.case_id
 AND c.is_deleted = 0
JOIN involves_in ii
  ON ii.case_id = i.case_id
 AND ii.person_id = i.person_id
 AND ii.is_deleted = 0
JOIN player pl
  ON pl.person_id = ii.person_id
 AND pl.is_deleted = 0
JOIN person pp
  ON pp.person_id = pl.person_id
 AND pp.is_deleted = 0
WHERE i.admin_id = :admin_id
  AND i.is_deleted = 0
ORDER BY c.date_opened DESC, c.case_id DESC, pp.first_name, pp.last_name