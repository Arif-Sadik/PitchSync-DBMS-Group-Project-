--------------------------------------------------------------------------------
-- Q05 - COMPLAINT DETAILS + LINKED CASES
-- Trace: 02-complaints/complaints.ts (findComplaintById) -> GET /api/integrity/complaints/[complaintId] -> features/integrity/02-complaints/complaint-details.tsx
-- UI: /integrity/complaints/[complaintId]
-- Bind: :complaint_id
-- Concepts: LEFT JOIN, optional M:N relationship traversal, ORDER BY
-- A complaint remains visible even when it has not produced a case.
--------------------------------------------------------------------------------

SELECT
    comp.complaint_id,
    comp.source_type,
    comp.date_received,
    comp.description,
    comp.misconduct_type,

    c.case_id,
    c.status AS case_status,
    c.date_opened AS case_date_opened
FROM complaint comp
LEFT JOIN source_of s
  ON s.complaint_id = comp.complaint_id
 AND s.is_deleted = 0
LEFT JOIN case_record c
  ON c.case_id = s.case_id
 AND c.is_deleted = 0
WHERE comp.complaint_id = :complaint_id
  AND comp.is_deleted = 0
ORDER BY c.date_opened DESC NULLS LAST, c.case_id DESC NULLS LAST
