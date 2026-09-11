--------------------------------------------------------------------------------
-- PitchSync - Register a Complaint
--
-- Inserts a complaint and returns the generated complaint reference via the
-- seq_complaint default. The RETURNING clause supplies the new complaint_id.
--
-- Bind: :sourceType, :dateReceived, :description, :misconductType
-- Return: :complaintId (number)
--------------------------------------------------------------------------------

INSERT INTO complaint (
    complaint_id,
    source_type,
    date_received,
    description,
    misconduct_type,
    is_deleted
)
VALUES (
    seq_complaint.NEXTVAL,
    :sourceType,
    TO_DATE(:dateReceived, 'YYYY-MM-DD'),
    :description,
    :misconductType,
    0
)
RETURNING complaint_id INTO :complaintId