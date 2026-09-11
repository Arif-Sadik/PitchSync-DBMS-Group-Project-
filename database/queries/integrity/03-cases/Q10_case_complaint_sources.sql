--------------------------------------------------------------------------------
-- Q10 - CASE DETAILS: COMPLAINT SOURCES
-- Trace: 03-cases/case-details.ts (findCaseById) -> GET /api/integrity/cases/[caseId] | GET /api/integrity/my-cases/[caseId] -> 03-cases/manager-case-details.tsx | 03-cases/investigator-case-details.tsx
-- UI: /integrity/cases/[caseId] -> Complaint Sources tab
-- Bind: :case_id
-- Concepts: CASE_RECORD -> SOURCE_OF -> COMPLAINT relationship traversal
--------------------------------------------------------------------------------

SELECT
    comp.complaint_id,
    comp.date_received,
    comp.source_type,
    comp.description,
    comp.misconduct_type
FROM case_record c
JOIN source_of s
  ON s.case_id = c.case_id
 AND s.is_deleted = 0
JOIN complaint comp
  ON comp.complaint_id = s.complaint_id
 AND comp.is_deleted = 0
WHERE c.case_id = :case_id
  AND c.is_deleted = 0
ORDER BY comp.date_received DESC, comp.complaint_id DESC
