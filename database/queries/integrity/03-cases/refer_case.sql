--------------------------------------------------------------------------------
-- PitchSync - Refer a Case
--
-- Records an EXTERNAL referral only. The internal case lifecycle is a
-- separate concept and remains untouched:
--
--   referral_status      -> 'REFERRED'
--   referred_to_authority -> :authority
--
-- status is NOT modified here (OPEN / UNDER_INVESTIGATION / CLOSED).
-- The ck_case_referral_consistency constraint requires REFERRED to be
-- paired with a non-null authority, satisfied by this single statement.
--
-- Bind: :caseId, :authority
--------------------------------------------------------------------------------

UPDATE case_record
SET referral_status       = 'REFERRED',
    referred_to_authority = :authority
WHERE case_id             = :caseId
  AND is_deleted          = 0