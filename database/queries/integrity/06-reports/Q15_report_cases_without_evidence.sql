--------------------------------------------------------------------------------
-- Q15 - REPORT: UNRESOLVED CASES WITHOUT EVIDENCE
-- Trace: 06-reports/reports.ts (getCasesWithoutEvidence) -> GET /api/integrity/reports/cases-without-evidence -> features/integrity/06-reports/integrity-reports.tsx
-- UI: /integrity/reports -> Investigation Monitoring
-- Concepts: correlated NOT EXISTS subquery, IN, weak-entity absence
--------------------------------------------------------------------------------

SELECT
    c.case_id,
    c.status,
    c.date_opened,
    c.involvement_type,
    c.referral_status
FROM case_record c
WHERE c.is_deleted = 0
  AND c.status IN ('OPEN', 'UNDER_INVESTIGATION', 'REFERRED')
  AND NOT EXISTS (
        SELECT 1
        FROM evidence e
        WHERE e.case_id = c.case_id
          AND e.is_deleted = 0
      )
ORDER BY c.date_opened, c.case_id
