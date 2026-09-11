--------------------------------------------------------------------------------
-- Q13 - RULEBOOK REGISTRY / SEARCH
-- Trace: 05-rulebook/rulebook.ts (listRules) -> GET /api/integrity/rulebook -> features/integrity/05-rulebook/rulebook-registry.tsx
-- UI: /integrity/rulebook
-- Optional binds:
--   :q
--   :category
-- Concepts: LIKE, UPPER, correlated scalar subquery, COUNT
--------------------------------------------------------------------------------

SELECT
    r.rule_id,
    r.clause_no AS clause_number,
    r.category,

    (SELECT COUNT(*)
       FROM violates v
       JOIN case_record c
         ON c.case_id = v.case_id
        AND c.is_deleted = 0
      WHERE v.rule_id = r.rule_id
        AND v.is_deleted = 0) AS linked_cases
FROM rulebook r
WHERE r.is_deleted = 0
  AND (
        :q IS NULL
        OR UPPER(TO_CHAR(r.rule_id)) LIKE '%' || UPPER(:q) || '%'
        OR UPPER(r.clause_no) LIKE '%' || UPPER(:q) || '%'
        OR UPPER(r.category) LIKE '%' || UPPER(:q) || '%'
      )
  AND (
        :category IS NULL
        OR UPPER(r.category) LIKE '%' || UPPER(:category) || '%'
      )
ORDER BY r.category, r.clause_no, r.rule_id
OFFSET :rowOffset ROWS FETCH NEXT :rowLimit ROWS ONLY
