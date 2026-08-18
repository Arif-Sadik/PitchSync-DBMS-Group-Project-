/*
  PitchSync Trigger: Validate investigator administrative role

  INVESTIGATES implements the ER aggregation.
  Only an Integrity & Compliance Officer may be assigned as investigator.

  Run AFTER the core schema is created.
*/

CREATE OR REPLACE TRIGGER trg_investigates_admin_role
BEFORE INSERT OR UPDATE OF admin_id ON investigates
FOR EACH ROW
DECLARE
    v_designation admin.designation%TYPE;
BEGIN
    SELECT designation
      INTO v_designation
      FROM admin
     WHERE person_id = :NEW.admin_id;

    IF v_designation <> 'Integrity & Compliance Officer' THEN
        RAISE_APPLICATION_ERROR(
            -20002,
            'Assigned investigator must be an Integrity & Compliance Officer.'
        );
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20003, 'Assigned investigator admin does not exist.');
END;
/
