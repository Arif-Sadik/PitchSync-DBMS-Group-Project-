-- Q04: All allegedly violated rules for one case

SELECT
    r.rule_id,
    r.category,
    r.clause_no
FROM violates v
JOIN rulebook r
    ON r.rule_id = v.rule_id
WHERE v.case_id = 5001
ORDER BY r.category, r.clause_no;
