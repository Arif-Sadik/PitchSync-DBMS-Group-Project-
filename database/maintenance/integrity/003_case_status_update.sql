UPDATE case_record c
SET c.status = 'UNDER_INVESTIGATION'
WHERE c.status = 'OPEN'
  AND c.is_deleted = 0
  AND EXISTS (
      SELECT 1
      FROM investigates i
      WHERE i.case_id = c.case_id
        AND i.is_deleted = 0
  );

COMMIT;