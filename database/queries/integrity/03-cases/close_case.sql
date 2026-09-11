--------------------------------------------------------------------------------
-- PitchSync - Close a Case
--
-- Marks the case as closed. Existing referral fields stay untouched and remain
-- consistent with the ck_case_referral_consistency constraint.
--
-- Bind: :caseId
--------------------------------------------------------------------------------

UPDATE case_record
SET status = 'CLOSED'
WHERE case_id = :caseId