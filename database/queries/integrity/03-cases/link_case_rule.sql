--------------------------------------------------------------------------------
-- PitchSync - Link a Rule to a Case
--
-- Records a VIOLATES link for a case-rule pair. The MERGE restores a previously
-- unlinked soft-deleted row instead of duplicating the composite key
-- (case_id, rule_id).
--
-- Bind: :caseId, :ruleId
--------------------------------------------------------------------------------

MERGE INTO violates target
USING (
    SELECT
        :caseId AS case_id,
        :ruleId AS rule_id
    FROM dual
) source
ON (
    target.case_id = source.case_id
    AND target.rule_id = source.rule_id
)
WHEN MATCHED THEN
    UPDATE SET
        target.is_deleted = 0
WHEN NOT MATCHED THEN
    INSERT (
        case_id,
        rule_id,
        is_deleted
    )
    VALUES (
        source.case_id,
        source.rule_id,
        0
    )