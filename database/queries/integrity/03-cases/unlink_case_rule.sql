--------------------------------------------------------------------------------
-- PitchSync - Unlink a Rule from a Case
--
-- Soft-deletes the VIOLATES link for a case-rule pair. The row keeps its
-- composite key (case_id, rule_id) and can be restored by link_case_rule.sql.
--
-- Bind: :caseId, :ruleId
--------------------------------------------------------------------------------

UPDATE violates
SET is_deleted = 1
WHERE case_id = :caseId
  AND rule_id = :ruleId