--------------------------------------------------------------------------------
-- PitchSync - Add Evidence to Case
--
-- Evidence is a weak entity identified by (case_id, evidence_no). The next
-- evidence number is derived from the current maximum per case, so a removed
-- evidence number is not reused while a higher one exists.
--
-- Bind: :caseId, :description, :collectedDate
-- Return: :evidenceNo (number)
--------------------------------------------------------------------------------

INSERT INTO evidence (
    case_id,
    evidence_no,
    description,
    collected_date,
    is_deleted
)
VALUES (
    :caseId,
    (
        SELECT NVL(MAX(e.evidence_no), 0) + 1
        FROM evidence e
        WHERE e.case_id = :caseId
    ),
    :description,
    TO_DATE(:collectedDate, 'YYYY-MM-DD'),
    0
)
RETURNING evidence_no INTO :evidenceNo