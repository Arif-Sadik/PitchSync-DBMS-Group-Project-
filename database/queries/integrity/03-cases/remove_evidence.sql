--------------------------------------------------------------------------------
-- PitchSync - Remove Case Evidence
--
-- Soft-deletes an evidence item. The weak key (case_id, evidence_no) is kept
-- so the row stays absent from active case evidence while remaining in history.
--
-- Bind: :caseId, :evidenceNo
--------------------------------------------------------------------------------

UPDATE evidence
SET is_deleted = 1
WHERE case_id   = :caseId
  AND evidence_no = :evidenceNo