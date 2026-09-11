--------------------------------------------------------------------------------
-- Q11 - CASE DETAILS: RULES & VIOLATIONS
-- Trace: 03-cases/case-details.ts (findCaseById) -> GET /api/integrity/cases/[caseId] | GET /api/integrity/my-cases/[caseId] -> 03-cases/case-rule-manager.tsx
-- UI: /integrity/cases/[caseId] -> Rules & Violations tab
-- Bind: :case_id
-- Concepts: CASE_RECORD -> VIOLATES -> RULEBOOK M:N traversal
--------------------------------------------------------------------------------

SELECT
    r.rule_id,
    r.clause_no AS clause_number,
    r.category
FROM case_record c
JOIN violates v
  ON v.case_id = c.case_id
 AND v.is_deleted = 0
JOIN rulebook r
  ON r.rule_id = v.rule_id
 AND r.is_deleted = 0
WHERE c.case_id = :case_id
  AND c.is_deleted = 0
ORDER BY r.category, r.clause_no, r.rule_id
