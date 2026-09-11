--------------------------------------------------------------------------------
-- Q03 - COMPLAINTS WITHOUT AN OPENED CASE
-- Trace: 02-complaints/pending-complaints.ts (getPendingComplaints) -> GET /api/integrity/pending-complaints -> 03-cases/open-case.tsx candidate list
-- UI: /integrity/complaints -> Pending complaints / manager dashboard
-- Concepts: correlated NOT EXISTS subquery, relationship absence, ORDER BY
-- Purpose: complaints that are not linked to any active CASE_RECORD through SOURCE_OF.
--------------------------------------------------------------------------------

SELECT
    comp.complaint_id,
    comp.date_received,
    comp.source_type,
    comp.misconduct_type,
    comp.description
FROM complaint comp
WHERE comp.is_deleted = 0
  AND NOT EXISTS (
        SELECT 1
        FROM source_of s
        JOIN case_record c
          ON c.case_id = s.case_id
         AND c.is_deleted = 0
        WHERE s.complaint_id = comp.complaint_id
          AND s.is_deleted = 0
      )
ORDER BY comp.date_received DESC, comp.complaint_id DESC
