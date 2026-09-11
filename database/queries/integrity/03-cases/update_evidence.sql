--------------------------------------------------------------------------------
-- PitchSync - Update Case Evidence
--
-- Updates only the descriptive attributes of an evidence item. The weak key
-- (case_id, evidence_no) is unchanged.
--
-- Bind: :caseId, :evidenceNo, :description, :collectedDate
--------------------------------------------------------------------------------

UPDATE evidence
SET description    = :description,
    collected_date = TO_DATE(:collectedDate, 'YYYY-MM-DD')
WHERE case_id      = :caseId
  AND evidence_no  = :evidenceNo