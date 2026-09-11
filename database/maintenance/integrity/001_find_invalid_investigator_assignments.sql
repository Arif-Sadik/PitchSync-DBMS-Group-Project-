SELECT
    i.case_id,
    i.person_id AS player_id,
    i.admin_id,
    p.first_name || ' ' || p.last_name AS investigator_name,
    ioa.access_scope,
    i.is_deleted
FROM investigates i
JOIN person p
    ON p.person_id = i.admin_id
LEFT JOIN integrity_officer_access ioa
    ON ioa.admin_id = i.admin_id
   AND ioa.is_deleted = 0
WHERE i.admin_id = 200005;