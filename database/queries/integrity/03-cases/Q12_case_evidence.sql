--------------------------------------------------------------------------------
-- Q12 - CASE DETAILS: EVIDENCE
-- Trace: 03-cases/case-details.ts (findCaseById) -> GET /api/integrity/cases/[caseId] | GET /api/integrity/my-cases/[caseId] -> 03-cases/case-evidence-manager.tsx
-- UI: /integrity/cases/[caseId] -> Evidence tab
-- Bind: :case_id
-- Concepts: weak entity / identifying relationship, composite identity, ORDER BY
-- Explicit CASE_RECORD -> EVIDENCE join is kept to demonstrate the weak entity relation.
--------------------------------------------------------------------------------

SELECT
    e.case_id,
    e.evidence_no AS evidence_number,
    e.description,
    e.collected_date
FROM case_record c
JOIN evidence e
  ON e.case_id = c.case_id
 AND e.is_deleted = 0
WHERE c.case_id = :case_id
  AND c.is_deleted = 0
ORDER BY e.evidence_no
