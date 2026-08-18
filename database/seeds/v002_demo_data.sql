/* ============================================================
   PitchSync - Integrity Module Sample Data
   ============================================================ */

SET DEFINE OFF;
/* ============================================================
   1. PERSON
   ============================================================ */


INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(1001, 'Shakib', 'Al Hasan', DATE '1987-03-24', 'Dhaka', 'Magura');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(1002, 'Tamim', 'Iqbal', DATE '1989-03-20', 'Chattogram', 'Chattogram');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(1003, 'Mushfiqur', 'Rahim', DATE '1987-05-09', 'Dhaka', 'Bogura');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(1101, 'Arif', 'Hossain', DATE '1998-05-12', 'Dhaka', 'Cumilla');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(1102, 'Rafiul', 'Karim', DATE '1997-08-20', 'Chattogram', 'Noakhali');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(1103, 'Nabil', 'Ahmed', DATE '2000-03-15', 'Sylhet', 'Sylhet');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(1104, 'Tanvir', 'Hasan', DATE '1999-11-01', 'Khulna', 'Jessore');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(1105, 'Mehedi', 'Rahman', DATE '1998-09-11', 'Rajshahi', 'Rajshahi');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(1106, 'Sajid', 'Mahmud', DATE '2001-01-17', 'Dhaka', 'Barishal');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(1107, 'Fahim', 'Chowdhury', DATE '1999-06-30', 'Rangpur', 'Rangpur');


/* Admin persons */

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(2001, 'Farhan', 'Kabir', DATE '1985-06-10', 'Dhaka', 'Dhaka');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(2002, 'Nusrat', 'Jahan', DATE '1988-09-22', 'Dhaka', 'Rajshahi');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(2003, 'Imran', 'Hossain', DATE '1983-01-18', 'Dhaka', 'Barishal');

INSERT INTO person
(person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES
(2004, 'Samira', 'Ahmed', DATE '1986-04-25', 'Dhaka', 'Cumilla');


/* ============================================================
   2. PLAYER
   ============================================================ */

INSERT INTO player
(person_id, player_role, gender, education, family_background)
VALUES
(1001, 'All-rounder', 'MALE', 'Graduate', 'Professional cricket background');

INSERT INTO player
(person_id, player_role, gender, education, family_background)
VALUES
(1002, 'Batter', 'MALE', 'Graduate', 'Professional cricket background');

INSERT INTO player
(person_id, player_role, gender, education, family_background)
VALUES
(1003, 'Wicketkeeper/Batter', 'MALE', 'Graduate', 'Professional cricket background');

INSERT INTO player
(person_id, player_role, gender, education, family_background)
VALUES
(1101, 'Batter', 'MALE', 'Graduate', 'Sports-oriented family');

INSERT INTO player
(person_id, player_role, gender, education, family_background)
VALUES
(1102, 'Bowler', 'MALE', 'Graduate', 'General family');

INSERT INTO player
(person_id, player_role, gender, education, family_background)
VALUES
(1103, 'All-rounder', 'MALE', 'Undergraduate', 'Cricket-oriented family');

INSERT INTO player
(person_id, player_role, gender, education, family_background)
VALUES
(1104, 'Wicketkeeper/Batter', 'MALE', 'Graduate', 'General family');

INSERT INTO player
(person_id, player_role, gender, education, family_background)
VALUES
(1105, 'Batter', 'MALE', 'Undergraduate', 'Sports family');

INSERT INTO player
(person_id, player_role, gender, education, family_background)
VALUES
(1106, 'Bowler', 'MALE', 'Undergraduate', 'General family');

INSERT INTO player
(person_id, player_role, gender, education, family_background)
VALUES
(1107, 'All-rounder', 'MALE', 'Graduate', 'General family');


/* ============================================================
   3. ADMIN
   ============================================================ */

INSERT INTO admin
(person_id, designation, department, email, joining_date)
VALUES
(
    2001,
    'Integrity & Compliance Officer',
    'Integrity & Compliance',
    'farhan.kabir@example.invalid',
    DATE '2020-01-10'
);

INSERT INTO admin
(person_id, designation, department, email, joining_date)
VALUES
(
    2002,
    'Integrity & Compliance Officer',
    'Integrity & Compliance',
    'nusrat.jahan@example.invalid',
    DATE '2021-03-15'
);

INSERT INTO admin
(person_id, designation, department, email, joining_date)
VALUES
(
    2003,
    'Cricket Board Administrator',
    'Administration',
    'imran.hossain@example.invalid',
    DATE '2019-07-01'
);

INSERT INTO admin
(person_id, designation, department, email, joining_date)
VALUES
(
    2004,
    'Integrity & Compliance Officer',
    'Integrity & Compliance',
    'samira.ahmed@example.invalid',
    DATE '2022-02-01'
);


/* ============================================================
   4. RULEBOOK
   ============================================================ */

INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (3001, '1.1', 'Anti-Corruption');

INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (3002, '1.2', 'Anti-Corruption');

INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (3003, '2.1', 'Code of Conduct');

INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (3004, '2.2', 'Code of Conduct');

INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (3005, '3.1', 'Disciplinary');

INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (3006, '4.1', 'Match Integrity');

INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (3007, '4.2', 'Match Integrity');

INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (3008, '5.1', 'Confidentiality');


/* ============================================================
   5. COMPLAINT
   4007 and 4008 intentionally have no cases.
   ============================================================ */

INSERT INTO complaint
(complaint_id, source_type, date_received, description, misconduct_type)
VALUES
(
    4001,
    'Match Official Report',
    DATE '2026-06-15',
    'Unusual communication was observed before a domestic match.',
    'Integrity Concern'
);

INSERT INTO complaint
(complaint_id, source_type, date_received, description, misconduct_type)
VALUES
(
    4002,
    'Team Management Report',
    DATE '2026-06-22',
    'Player behaviour during team activities requires investigation.',
    'Misconduct'
);

INSERT INTO complaint
(complaint_id, source_type, date_received, description, misconduct_type)
VALUES
(
    4003,
    'Anonymous Tip',
    DATE '2026-07-01',
    'Possible unauthorized sharing of confidential match information.',
    'Confidentiality Concern'
);

INSERT INTO complaint
(complaint_id, source_type, date_received, description, misconduct_type)
VALUES
(
    4004,
    'Tournament Official',
    DATE '2026-07-08',
    'Possible violation of competition conduct regulations.',
    'Code of Conduct'
);

INSERT INTO complaint
(complaint_id, source_type, date_received, description, misconduct_type)
VALUES
(
    4005,
    'Security Report',
    DATE '2026-07-15',
    'Suspicious contact with an unauthorized individual was reported.',
    'Possible Corruption'
);

INSERT INTO complaint
(complaint_id, source_type, date_received, description, misconduct_type)
VALUES
(
    4006,
    'Cricket Board Report',
    DATE '2026-07-21',
    'Potential breach of match integrity rules requires review.',
    'Match Integrity'
);

INSERT INTO complaint
(complaint_id, source_type, date_received, description, misconduct_type)
VALUES
(
    4007,
    'Email',
    DATE '2026-08-02',
    'Complaint is waiting for preliminary assessment.',
    'Misconduct'
);

INSERT INTO complaint
(complaint_id, source_type, date_received, description, misconduct_type)
VALUES
(
    4008,
    'Hotline Report',
    DATE '2026-08-05',
    'Information received through the integrity reporting channel.',
    'Integrity Concern'
);


/* ============================================================
   6. CASE_RECORD

   Active:
   5001 OPEN
   5002 UNDER_INVESTIGATION
   5003 REFERRED
   5004 OPEN
   5005 UNDER_INVESTIGATION
   5006 OPEN
   5008 REFERRED

   Closed:
   5007
   5009
   ============================================================ */

INSERT INTO case_record
(case_id, status, involvement_type, date_opened,
 referral_status, referred_to_authority)
VALUES
(5001, 'OPEN', 'Primary Subject',
 DATE '2026-06-16', 'NOT_REFERRED', NULL);

INSERT INTO case_record
(case_id, status, involvement_type, date_opened,
 referral_status, referred_to_authority)
VALUES
(5002, 'UNDER_INVESTIGATION', 'Primary Subject',
 DATE '2026-06-23', 'NOT_REFERRED', NULL);

INSERT INTO case_record
(case_id, status, involvement_type, date_opened,
 referral_status, referred_to_authority)
VALUES
(5003, 'REFERRED', 'Primary Subject',
 DATE '2026-07-02', 'REFERRED',
 'Bangladesh Cricket Board Disciplinary Committee');

INSERT INTO case_record
(case_id, status, involvement_type, date_opened,
 referral_status, referred_to_authority)
VALUES
(5004, 'OPEN', 'Associated Player',
 DATE '2026-07-09', 'NOT_REFERRED', NULL);

INSERT INTO case_record
(case_id, status, involvement_type, date_opened,
 referral_status, referred_to_authority)
VALUES
(5005, 'UNDER_INVESTIGATION', 'Primary Subject',
 DATE '2026-07-16', 'NOT_REFERRED', NULL);

INSERT INTO case_record
(case_id, status, involvement_type, date_opened,
 referral_status, referred_to_authority)
VALUES
(5006, 'OPEN', 'Associated Player',
 DATE '2026-07-22', 'NOT_REFERRED', NULL);

INSERT INTO case_record
(case_id, status, involvement_type, date_opened,
 referral_status, referred_to_authority)
VALUES
(5007, 'CLOSED', 'Primary Subject',
 DATE '2026-05-10', 'NOT_REFERRED', NULL);

INSERT INTO case_record
(case_id, status, involvement_type, date_opened,
 referral_status, referred_to_authority)
VALUES
(5008, 'REFERRED', 'Primary Subject',
 DATE '2026-07-25', 'REFERRED',
 'National Anti-Corruption Authority');

INSERT INTO case_record
(case_id, status, involvement_type, date_opened,
 referral_status, referred_to_authority)
VALUES
(5009, 'CLOSED', 'Associated Player',
 DATE '2026-05-20', 'NOT_REFERRED', NULL);


/* ============================================================
   7. SOURCE_OF

   Case 5006 intentionally has no complaint.
   Complaints 4007 and 4008 remain unlinked.
   ============================================================ */

INSERT INTO source_of (case_id, complaint_id)
VALUES (5001, 4001);

INSERT INTO source_of (case_id, complaint_id)
VALUES (5002, 4002);

INSERT INTO source_of (case_id, complaint_id)
VALUES (5003, 4003);

INSERT INTO source_of (case_id, complaint_id)
VALUES (5004, 4004);

INSERT INTO source_of (case_id, complaint_id)
VALUES (5005, 4005);

INSERT INTO source_of (case_id, complaint_id)
VALUES (5007, 4006);


/* ============================================================
   8. INVOLVES_IN
   ============================================================ */

INSERT INTO involves_in (person_id, case_id)
VALUES (1101, 5001);

INSERT INTO involves_in (person_id, case_id)
VALUES (1102, 5001);

INSERT INTO involves_in (person_id, case_id)
VALUES (1103, 5002);

INSERT INTO involves_in (person_id, case_id)
VALUES (1104, 5002);

INSERT INTO involves_in (person_id, case_id)
VALUES (1101, 5003);

INSERT INTO involves_in (person_id, case_id)
VALUES (1105, 5003);

INSERT INTO involves_in (person_id, case_id)
VALUES (1106, 5004);

INSERT INTO involves_in (person_id, case_id)
VALUES (1102, 5005);

INSERT INTO involves_in (person_id, case_id)
VALUES (1107, 5005);

INSERT INTO involves_in (person_id, case_id)
VALUES (1104, 5006);

INSERT INTO involves_in (person_id, case_id)
VALUES (1103, 5007);

INSERT INTO involves_in (person_id, case_id)
VALUES (1105, 5008);

INSERT INTO involves_in (person_id, case_id)
VALUES (1106, 5009);


/* ============================================================
   9. INVESTIGATES

   1104 / 5006 intentionally has no investigator.
   Useful for Q14.
   ============================================================ */

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1101, 5001, 2001);

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1102, 5001, 2002);

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1103, 5002, 2001);

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1104, 5002, 2004);

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1101, 5003, 2001);

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1105, 5003, 2002);

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1106, 5004, 2004);

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1102, 5005, 2001);

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1107, 5005, 2002);

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1103, 5007, 2004);

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1105, 5008, 2001);

INSERT INTO investigates
(person_id, case_id, admin_id)
VALUES (1106, 5009, 2002);


/* ============================================================
   10. VIOLATES

   Rule 3001 occurs frequently.
   Rule 3003 also appears several times.
   ============================================================ */

INSERT INTO violates (case_id, rule_id)
VALUES (5001, 3001);

INSERT INTO violates (case_id, rule_id)
VALUES (5001, 3003);

INSERT INTO violates (case_id, rule_id)
VALUES (5002, 3002);

INSERT INTO violates (case_id, rule_id)
VALUES (5002, 3003);

INSERT INTO violates (case_id, rule_id)
VALUES (5003, 3001);

INSERT INTO violates (case_id, rule_id)
VALUES (5003, 3008);

INSERT INTO violates (case_id, rule_id)
VALUES (5004, 3004);

INSERT INTO violates (case_id, rule_id)
VALUES (5005, 3001);

INSERT INTO violates (case_id, rule_id)
VALUES (5005, 3006);

INSERT INTO violates (case_id, rule_id)
VALUES (5006, 3003);

INSERT INTO violates (case_id, rule_id)
VALUES (5007, 3005);

INSERT INTO violates (case_id, rule_id)
VALUES (5008, 3001);

INSERT INTO violates (case_id, rule_id)
VALUES (5008, 3007);

INSERT INTO violates (case_id, rule_id)
VALUES (5009, 3004);


/* ============================================================
   11. EVIDENCE

   Case 5006 intentionally has no evidence.
   ============================================================ */

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5001, 1,
 'Match official communication log.',
 DATE '2026-06-17');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5001, 2,
 'Statement collected from team management.',
 DATE '2026-06-18');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5002, 1,
 'Team disciplinary report.',
 DATE '2026-06-24');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5002, 2,
 'Player interview summary.',
 DATE '2026-06-25');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5003, 1,
 'Digital communication records.',
 DATE '2026-07-03');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5003, 2,
 'Confidential document access record.',
 DATE '2026-07-04');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5004, 1,
 'Tournament official written report.',
 DATE '2026-07-10');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5005, 1,
 'Security department incident report.',
 DATE '2026-07-17');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5005, 2,
 'Access-control log review.',
 DATE '2026-07-18');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5007, 1,
 'Final disciplinary investigation report.',
 DATE '2026-05-25');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5008, 1,
 'Investigation referral package.',
 DATE '2026-07-26');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5008, 2,
 'Supporting financial transaction summary.',
 DATE '2026-07-27');

INSERT INTO evidence
(case_id, evidence_no, description, collected_date)
VALUES
(5009, 1,
 'Case closure report.',
 DATE '2026-06-01');


COMMIT;