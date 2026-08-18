/*
  PitchSync Trigger: Validate PERSON.dob
  Oracle CHECK constraints cannot safely use SYSDATE for this rule.

  Run AFTER the core schema is created.
*/

CREATE OR REPLACE TRIGGER trg_person_dob_valid
BEFORE INSERT OR UPDATE OF dob ON person
FOR EACH ROW
BEGIN
    IF :NEW.dob > TRUNC(SYSDATE) THEN
        RAISE_APPLICATION_ERROR(-20001, 'DOB cannot be in the future.');
    END IF;
END;
/
