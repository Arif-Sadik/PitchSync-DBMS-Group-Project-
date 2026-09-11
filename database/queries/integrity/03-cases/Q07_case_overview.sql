--------------------------------------------------------------------------------
-- Q07 - CASE DETAILS: OVERVIEW
-- Trace: 03-cases/case-details.ts (findCaseById) -> GET /api/integrity/cases/[caseId] (Manager) | GET /api/integrity/my-cases/[caseId] (Investigator) -> 03-cases/manager-case-details.tsx | 03-cases/investigator-case-details.tsx
-- UI: /integrity/cases/[caseId] -> header + Overview tab
-- Bind: :case_id
-- Concepts: simple SELECT, selection, projection
-- Purpose: intentionally simple; normalized related data is loaded by Q08-Q12.
--------------------------------------------------------------------------------

SELECT
    c.case_id,
    c.status,
    c.date_opened,
    c.involvement_type,
    c.referral_status,
    c.referred_to_authority
FROM case_record c
WHERE c.case_id = :case_id
  AND c.is_deleted = 0
