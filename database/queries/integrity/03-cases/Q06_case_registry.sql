--------------------------------------------------------------------------------
-- Q06 - INTEGRITY CASE REGISTRY / SEARCH
-- Trace: 03-cases/case-registry.ts (listCases) -> GET /api/integrity/cases -> features/integrity/03-cases/case-registry.tsx
-- UI: /integrity/cases (MANAGER sees department-wide registry)
-- Optional binds:
--   :q       search text
--   :status  status text
--   :opened  DATE (exact calendar date)
-- Concepts: optional filters, correlated scalar subqueries, COUNT, DISTINCT
--
-- Only two useful registry counts are kept:
--   involved players and assigned investigators.
-- Detailed complaints/rules/evidence are handled by focused case-detail queries.
--------------------------------------------------------------------------------

SELECT
    c.case_id,
    c.status,
    c.date_opened,
    c.involvement_type,
    c.referral_status,
    c.referred_to_authority,

    (SELECT COUNT(*)
       FROM involves_in ii
       JOIN player pl
         ON pl.person_id = ii.person_id
        AND pl.is_deleted = 0
       JOIN person pp
         ON pp.person_id = pl.person_id
        AND pp.is_deleted = 0
      WHERE ii.case_id = c.case_id
        AND ii.is_deleted = 0) AS involved_players,

    (SELECT COUNT(DISTINCT a.person_id)
       FROM investigates i
       JOIN involves_in ii
         ON ii.person_id = i.person_id
        AND ii.case_id = i.case_id
        AND ii.is_deleted = 0
       JOIN player pl
         ON pl.person_id = ii.person_id
        AND pl.is_deleted = 0
       JOIN person pp
         ON pp.person_id = pl.person_id
        AND pp.is_deleted = 0
       JOIN admin a
         ON a.person_id = i.admin_id
        AND a.is_deleted = 0
       JOIN person ap
         ON ap.person_id = a.person_id
        AND ap.is_deleted = 0
      WHERE i.case_id = c.case_id
        AND i.is_deleted = 0) AS assigned_investigators
FROM case_record c
WHERE c.is_deleted = 0
  AND (
        :q IS NULL
        OR UPPER(TO_CHAR(c.case_id)) LIKE '%' || UPPER(:q) || '%'
        OR UPPER(c.status) LIKE '%' || UPPER(:q) || '%'
        OR UPPER(NVL(c.involvement_type, '')) LIKE '%' || UPPER(:q) || '%'
        OR UPPER(NVL(c.referred_to_authority, '')) LIKE '%' || UPPER(:q) || '%'
      )
  AND (
        :status IS NULL
        OR UPPER(c.status) LIKE '%' || UPPER(:status) || '%'
      )
  AND (
        :opened IS NULL
        OR TRUNC(c.date_opened) = TRUNC(TO_DATE(:opened, 'YYYY-MM-DD'))
      )
ORDER BY c.date_opened DESC, c.case_id DESC
OFFSET :rowOffset ROWS FETCH NEXT :rowLimit ROWS ONLY
