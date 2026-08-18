--which cases the player involved in
SELECT
    c.case_id,
    c.status,
    c.involvement_type,
    c.date_opened,
    c.referral_status
FROM involves_in ii
JOIN case_record c
    ON c.case_id = ii.case_id
WHERE ii.person_id = 1101
ORDER BY c.date_opened DESC;
