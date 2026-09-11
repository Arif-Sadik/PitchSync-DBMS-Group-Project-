UPDATE investigates
SET is_deleted = 1
WHERE admin_id = 200005
  AND is_deleted = 0;

COMMIT;