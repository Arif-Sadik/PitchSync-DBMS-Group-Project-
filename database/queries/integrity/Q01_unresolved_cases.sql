-- Q01: All unresolved integrity cases

SELECT
    c.case_id,
    c.status,
    c.involvement_type,
    c.date_opened,
    c.referral_status,
    c.referred_to_authority
FROM case_record c
WHERE c.status IN ('OPEN', 'UNDER_INVESTIGATION', 'REFERRED')
ORDER BY c.date_opened DESC, c.case_id DESC;
