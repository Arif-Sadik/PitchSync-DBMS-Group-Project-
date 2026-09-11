--------------------------------------------------------------------------------
-- Q04 - COMPLAINT REGISTRY / SEARCH
-- Trace: 02-complaints/complaints.ts (listComplaints) -> GET /api/integrity/complaints -> features/integrity/02-complaints/complaint-registry.tsx
-- UI: /integrity/complaints
-- Optional binds:
--   :q          search text
--   :source     source-type text
--   :from_date  DATE
--   :to_date    DATE (treated as an inclusive calendar date)
-- Concepts: LIKE, UPPER, optional filters, correlated scalar subquery, COUNT
--------------------------------------------------------------------------------

SELECT
    comp.complaint_id,
    comp.date_received,
    comp.source_type,
    comp.description,
    comp.misconduct_type,

    (SELECT COUNT(*)
       FROM source_of s
       JOIN case_record c
         ON c.case_id = s.case_id
        AND c.is_deleted = 0
      WHERE s.complaint_id = comp.complaint_id
        AND s.is_deleted = 0) AS linked_cases
FROM complaint comp
WHERE comp.is_deleted = 0
  AND (
        :q IS NULL
        OR UPPER(TO_CHAR(comp.complaint_id)) LIKE '%' || UPPER(:q) || '%'
        OR UPPER(comp.source_type) LIKE '%' || UPPER(:q) || '%'
        OR UPPER(comp.description) LIKE '%' || UPPER(:q) || '%'
        OR UPPER(NVL(comp.misconduct_type, '')) LIKE '%' || UPPER(:q) || '%'
      )
  AND (
        :source IS NULL
        OR UPPER(comp.source_type) LIKE '%' || UPPER(:source) || '%'
      )
  AND (:from_date IS NULL OR comp.date_received >= TO_DATE(:from_date, 'YYYY-MM-DD'))
  AND (:to_date IS NULL OR comp.date_received < TO_DATE(:to_date, 'YYYY-MM-DD') + 1)
ORDER BY comp.date_received DESC, comp.complaint_id DESC
OFFSET :rowOffset ROWS FETCH NEXT :rowLimit ROWS ONLY
