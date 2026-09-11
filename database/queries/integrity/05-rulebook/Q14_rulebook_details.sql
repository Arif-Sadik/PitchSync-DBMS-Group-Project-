--------------------------------------------------------------------------------
-- Q14 - RULEBOOK DETAILS + LINKED ACTIVE CASES
-- Trace: 05-rulebook/rulebook.ts (findRuleById) -> GET /api/integrity/rulebook/[ruleId] -> features/integrity/05-rulebook/rulebook-details.tsx
-- UI: /integrity/rulebook/[ruleId]
-- Bind: :rule_id
-- Concepts: LEFT JOIN, inline view/subquery in FROM, M:N traversal
--
-- The inline view is intentional: it first forms valid active
-- VIOLATES -> CASE_RECORD relationships, then LEFT JOIN keeps the rule visible
-- even when it currently has no active linked cases.
--------------------------------------------------------------------------------

SELECT
    r.rule_id,
    r.clause_no AS clause_number,
    r.category,
    lc.case_id,
    lc.case_status,
    lc.case_date_opened,
    lc.involvement_type
FROM rulebook r
LEFT JOIN (
    SELECT
        v.rule_id,
        c.case_id,
        c.status AS case_status,
        c.date_opened AS case_date_opened,
        c.involvement_type
    FROM violates v
    JOIN case_record c
      ON c.case_id = v.case_id
     AND c.is_deleted = 0
    WHERE v.is_deleted = 0
) lc
  ON lc.rule_id = r.rule_id
WHERE r.rule_id = :rule_id
  AND r.is_deleted = 0
ORDER BY lc.case_date_opened DESC NULLS LAST,
         lc.case_id DESC NULLS LAST
