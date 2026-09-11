--------------------------------------------------------------------------------
-- PitchSync - Reopen a Case
--
-- Returns a closed case to UNDER_INVESTIGATION. The external referral
-- history is preserved exactly as it is:
--
--   referral_status      -> unchanged
--   referred_to_authority -> unchanged
--
-- Bind: :caseId
--------------------------------------------------------------------------------

UPDATE case_record
SET status = 'UNDER_INVESTIGATION'
WHERE case_id = :caseId
  AND is_deleted = 0