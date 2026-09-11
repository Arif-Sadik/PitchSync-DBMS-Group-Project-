--------------------------------------------------------------------------------
-- Q17 - REPORT: FREQUENTLY VIOLATED RULEBOOK CLAUSES
-- Trace: 06-reports/reports.ts (getFrequentlyViolatedRules) -> GET /api/integrity/reports/frequently-violated-rules -> features/integrity/06-reports/integrity-reports.tsx
-- UI: /integrity/reports -> Compliance Analytics (MANAGER)
-- Optional binds:
--   :minimum_cases  NUMBER; defaults to 2
--   :from_date      DATE
--   :to_date        DATE (inclusive calendar date)
-- Concepts: RULEBOOK -> VIOLATES -> CASE_RECORD, COUNT, GROUP BY, HAVING
--------------------------------------------------------------------------------

SELECT
    r.rule_id,
    r.clause_no AS clause_number,
    r.category,
    COUNT(*) AS case_count
FROM rulebook r
JOIN violates v
  ON v.rule_id = r.rule_id
 AND v.is_deleted = 0
JOIN case_record c
  ON c.case_id = v.case_id
 AND c.is_deleted = 0
WHERE r.is_deleted = 0
  AND (:from_date IS NULL OR c.date_opened >= TO_DATE(:from_date, 'YYYY-MM-DD'))
  AND (:to_date IS NULL OR c.date_opened < TO_DATE(:to_date, 'YYYY-MM-DD') + 1)
GROUP BY
    r.rule_id,
    r.clause_no,
    r.category
HAVING COUNT(*) >= NVL(:minimum_cases, 2)
ORDER BY case_count DESC, r.category, r.clause_no
