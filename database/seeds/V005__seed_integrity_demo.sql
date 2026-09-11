--------------------------------------------------------------------------------
-- PitchSync
-- Integrity Demo Expansion
--
-- Run after:
--   V003 core/demo data
--   V004 integrity officer access
--   V005 investigation finding
--
-- Purpose:
-- Adds varied Integrity data for dashboard, reports, findings,
-- workload, reassignment/cursor, referral and soft-delete demonstrations.
--------------------------------------------------------------------------------
SET DEFINE OFF;
DECLARE
    ----------------------------------------------------------------
    -- Existing baseline admins
    ----------------------------------------------------------------
    v_super_admin_id   NUMBER := 200001;
    v_manager_id       NUMBER := 200005;
    v_rezaul_id        NUMBER := 200006;

    ----------------------------------------------------------------
    -- New Integrity Officers
    ----------------------------------------------------------------
    v_ayesha_id        NUMBER;
    v_mahmud_id        NUMBER;
    v_tasnim_id        NUMBER;

    ----------------------------------------------------------------
    -- New complaints
    ----------------------------------------------------------------
    v_complaint_a      NUMBER;
    v_complaint_b      NUMBER;
    v_complaint_c      NUMBER;

    ----------------------------------------------------------------
    -- New cases
    ----------------------------------------------------------------
    v_case_a           NUMBER;
    v_case_b           NUMBER;
    v_case_c           NUMBER;
    v_case_d           NUMBER;

BEGIN

    ----------------------------------------------------------------
    -- 0. Normalize old demo assignments.
    --
    -- A MANAGER should not remain an active INVESTIGATES assignee.
    ----------------------------------------------------------------
    UPDATE investigates i
       SET i.is_deleted = 1
     WHERE i.is_deleted = 0
       AND EXISTS (
            SELECT 1
              FROM integrity_officer_access ioa
             WHERE ioa.admin_id = i.admin_id
               AND ioa.access_scope = 'MANAGER'
               AND ioa.is_deleted = 0
       );


    ----------------------------------------------------------------
    -- An OPEN case that already has an active investigator has
    -- already entered formal investigation.
    ----------------------------------------------------------------
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


    ----------------------------------------------------------------
    -- 1. NEW INTEGRITY INVESTIGATOR: Ayesha Rahman
    ----------------------------------------------------------------
    INSERT INTO person (
        person_id,
        first_name,
        last_name,
        dob,
        present_address,
        permanent_address
    )
    VALUES (
        seq_admin_person.NEXTVAL,
        'Ayesha',
        'Rahman',
        DATE '1990-04-12',
        address_type(
            'Road 11',
            'Dhanmondi',
            'Dhaka',
            'Dhaka'
        ),
        address_type(
            'College Road',
            'Mymensingh Sadar',
            'Mymensingh',
            'Mymensingh'
        )
    )
    RETURNING person_id INTO v_ayesha_id;


    INSERT INTO admin (
        person_id,
        designation,
        department,
        email,
        joining_date
    )
    VALUES (
        v_ayesha_id,
        'Integrity & Compliance Officer',
        'Integrity & Compliance',
        'ayesha.rahman@pitchsync.demo',
        DATE '2023-02-01'
    );


    INSERT INTO user_account (
        person_id,
        username,
        password_hash,
        account_status
    )
    VALUES (
        v_ayesha_id,
        TO_CHAR(v_ayesha_id) || '_ayesha_rahman',
        'UNUSABLE$SEED_ACCOUNT',
        'DISABLED'
    );


    INSERT INTO integrity_officer_access (
        admin_id,
        access_scope,
        assigned_by_admin_id,
        assigned_at,
        is_deleted
    )
    VALUES (
        v_ayesha_id,
        'INVESTIGATOR',
        v_super_admin_id,
        SYSTIMESTAMP,
        0
    );


    ----------------------------------------------------------------
    -- 2. NEW INTEGRITY INVESTIGATOR: Mahmudul Karim
    --
    -- This officer will intentionally receive TWO active assignments.
    -- Ideal source investigator for cursor/reassignment demonstration.
    ----------------------------------------------------------------
    INSERT INTO person (
        person_id,
        first_name,
        last_name,
        dob,
        present_address,
        permanent_address
    )
    VALUES (
        seq_admin_person.NEXTVAL,
        'Mahmudul',
        'Karim',
        DATE '1989-07-18',
        address_type(
            'Block B',
            'Bashundhara',
            'Dhaka',
            'Dhaka'
        ),
        address_type(
            'Station Road',
            'Bogura Sadar',
            'Bogura',
            'Rajshahi'
        )
    )
    RETURNING person_id INTO v_mahmud_id;


    INSERT INTO admin (
        person_id,
        designation,
        department,
        email,
        joining_date
    )
    VALUES (
        v_mahmud_id,
        'Integrity & Compliance Officer',
        'Integrity & Compliance',
        'mahmudul.karim@pitchsync.demo',
        DATE '2023-06-15'
    );


    INSERT INTO user_account (
        person_id,
        username,
        password_hash,
        account_status
    )
    VALUES (
        v_mahmud_id,
        TO_CHAR(v_mahmud_id) || '_mahmudul_karim',
        'UNUSABLE$SEED_ACCOUNT',
        'DISABLED'
    );


    INSERT INTO integrity_officer_access (
        admin_id,
        access_scope,
        assigned_by_admin_id,
        assigned_at,
        is_deleted
    )
    VALUES (
        v_mahmud_id,
        'INVESTIGATOR',
        v_super_admin_id,
        SYSTIMESTAMP,
        0
    );


    ----------------------------------------------------------------
    -- 3. NEW INTEGRITY INVESTIGATOR: Tasnim Ahmed
    --
    -- Intentionally receives ZERO assignments.
    -- Useful as replacement target for cursor demonstration.
    ----------------------------------------------------------------
    INSERT INTO person (
        person_id,
        first_name,
        last_name,
        dob,
        present_address,
        permanent_address
    )
    VALUES (
        seq_admin_person.NEXTVAL,
        'Tasnim',
        'Ahmed',
        DATE '1992-01-26',
        address_type(
            'Sector 7',
            'Uttara',
            'Dhaka',
            'Dhaka'
        ),
        address_type(
            'Sadar Road',
            'Patuakhali Sadar',
            'Patuakhali',
            'Barishal'
        )
    )
    RETURNING person_id INTO v_tasnim_id;


    INSERT INTO admin (
        person_id,
        designation,
        department,
        email,
        joining_date
    )
    VALUES (
        v_tasnim_id,
        'Integrity & Compliance Officer',
        'Integrity & Compliance',
        'tasnim.ahmed@pitchsync.demo',
        DATE '2024-01-08'
    );


    INSERT INTO user_account (
        person_id,
        username,
        password_hash,
        account_status
    )
    VALUES (
        v_tasnim_id,
        TO_CHAR(v_tasnim_id) || '_tasnim_ahmed',
        'UNUSABLE$SEED_ACCOUNT',
        'DISABLED'
    );


    INSERT INTO integrity_officer_access (
        admin_id,
        access_scope,
        assigned_by_admin_id,
        assigned_at,
        is_deleted
    )
    VALUES (
        v_tasnim_id,
        'INVESTIGATOR',
        v_super_admin_id,
        SYSTIMESTAMP,
        0
    );


    ----------------------------------------------------------------
    -- 4. NEW COMPLAINT A
    -- Will be linked to Case A.
    ----------------------------------------------------------------
    INSERT INTO complaint (
        source_type,
        date_received,
        description,
        misconduct_type
    )
    VALUES (
        'Financial Monitoring Report',
        DATE '2026-08-18',
        'Unusual financial contact involving two registered players requires formal review.',
        'Possible Corruption'
    )
    RETURNING complaint_id INTO v_complaint_a;


    ----------------------------------------------------------------
    -- 5. NEW COMPLAINT B
    -- Will be linked to Case C.
    ----------------------------------------------------------------
    INSERT INTO complaint (
        source_type,
        date_received,
        description,
        misconduct_type
    )
    VALUES (
        'Team Management Report',
        DATE '2026-08-22',
        'Repeated unauthorized communication was reported during tournament activity.',
        'Integrity Concern'
    )
    RETURNING complaint_id INTO v_complaint_b;


    ----------------------------------------------------------------
    -- 6. NEW COMPLAINT C
    -- Intentionally has NO case.
    -- Useful for Pending Complaints / Q03.
    ----------------------------------------------------------------
    INSERT INTO complaint (
        source_type,
        date_received,
        description,
        misconduct_type
    )
    VALUES (
        'Anonymous Tip',
        DATE '2026-08-28',
        'A new allegation was received and is waiting for preliminary assessment.',
        'Match Integrity Concern'
    )
    RETURNING complaint_id INTO v_complaint_c;


    ----------------------------------------------------------------
    -- 7. CASE A
    --
    -- Complaint-linked.
    -- Two involved players.
    -- Two different investigators.
    -- Evidence + rules.
    -- One pending finding.
    ----------------------------------------------------------------
    INSERT INTO case_record (
        status,
        involvement_type,
        date_opened,
        referral_status,
        referred_to_authority
    )
    VALUES (
        'UNDER_INVESTIGATION',
        'Primary Subject',
        DATE '2026-08-19',
        'NOT_REFERRED',
        NULL
    )
    RETURNING case_id INTO v_case_a;


    INSERT INTO source_of (
        case_id,
        complaint_id
    )
    VALUES (
        v_case_a,
        v_complaint_a
    );


    INSERT INTO involves_in (
        person_id,
        case_id
    )
    VALUES (
        100003,
        v_case_a
    );


    INSERT INTO involves_in (
        person_id,
        case_id
    )
    VALUES (
        100007,
        v_case_a
    );


    -- Ayesha gets one active assignment.
    INSERT INTO investigates (
        person_id,
        case_id,
        admin_id
    )
    VALUES (
        100003,
        v_case_a,
        v_ayesha_id
    );


    -- Mahmud gets first of two active assignments.
    INSERT INTO investigates (
        person_id,
        case_id,
        admin_id
    )
    VALUES (
        100007,
        v_case_a,
        v_mahmud_id
    );


    INSERT INTO violates (
        case_id,
        rule_id
    )
    VALUES (
        v_case_a,
        1
    );


    INSERT INTO violates (
        case_id,
        rule_id
    )
    VALUES (
        v_case_a,
        5
    );


    INSERT INTO evidence (
        case_id,
        evidence_no,
        description,
        collected_date
    )
    VALUES (
        v_case_a,
        1,
        'Financial monitoring summary related to the reported contact.',
        DATE '2026-08-20'
    );


    INSERT INTO evidence (
        case_id,
        evidence_no,
        description,
        collected_date
    )
    VALUES (
        v_case_a,
        2,
        'Interview notes from team management personnel.',
        DATE '2026-08-21'
    );


    -- Pending finding for Manager review.
    INSERT INTO investigation_finding (
        person_id,
        case_id,
        submitted_by_admin_id,
        conclusion,
        finding_description,
        recommendation,
        submitted_at,
        review_status,
        is_deleted
    )
    VALUES (
        100003,
        v_case_a,
        v_ayesha_id,
        'SUBSTANTIATED',
        'The available financial records and interview statements support further integrity action.',
        'EXTERNAL_REFERRAL',
        TIMESTAMP '2026-08-24 10:30:00',
        'PENDING',
        0
    );


    ----------------------------------------------------------------
    -- 8. CASE B
    --
    -- No complaint.
    -- OPEN.
    -- One player.
    -- NO investigator.
    -- NO evidence.
    --
    -- Useful for:
    --   Q15 Cases Without Evidence
    --   Q16 Unassigned Involvements
    ----------------------------------------------------------------
    INSERT INTO case_record (
        status,
        involvement_type,
        date_opened,
        referral_status,
        referred_to_authority
    )
    VALUES (
        'OPEN',
        'Associated Player',
        DATE '2026-08-25',
        'NOT_REFERRED',
        NULL
    )
    RETURNING case_id INTO v_case_b;


    INSERT INTO involves_in (
        person_id,
        case_id
    )
    VALUES (
        100005,
        v_case_b
    );


    ----------------------------------------------------------------
    -- 9. CASE C
    --
    -- Complaint-linked.
    -- Active investigation.
    -- Already externally referred.
    -- Mahmud's second active assignment.
    -- Has evidence + rule + accepted finding.
    ----------------------------------------------------------------
    INSERT INTO case_record (
        status,
        involvement_type,
        date_opened,
        referral_status,
        referred_to_authority
    )
    VALUES (
        'UNDER_INVESTIGATION',
        'Primary Subject',
        DATE '2026-08-23',
        'REFERRED',
        'National Anti-Corruption Commission'
    )
    RETURNING case_id INTO v_case_c;


    INSERT INTO source_of (
        case_id,
        complaint_id
    )
    VALUES (
        v_case_c,
        v_complaint_b
    );


    INSERT INTO involves_in (
        person_id,
        case_id
    )
    VALUES (
        100001,
        v_case_c
    );


    -- Mahmud's second ACTIVE assignment.
    INSERT INTO investigates (
        person_id,
        case_id,
        admin_id
    )
    VALUES (
        100001,
        v_case_c,
        v_mahmud_id
    );


    INSERT INTO violates (
        case_id,
        rule_id
    )
    VALUES (
        v_case_c,
        2
    );


    INSERT INTO evidence (
        case_id,
        evidence_no,
        description,
        collected_date
    )
    VALUES (
        v_case_c,
        1,
        'Verified communication record supplied by tournament security.',
        DATE '2026-08-24'
    );


    INSERT INTO investigation_finding (
        person_id,
        case_id,
        submitted_by_admin_id,
        conclusion,
        finding_description,
        recommendation,
        submitted_at,
        review_status,
        reviewed_by_admin_id,
        reviewed_at,
        manager_comment,
        is_deleted
    )
    VALUES (
        100001,
        v_case_c,
        v_mahmud_id,
        'SUBSTANTIATED',
        'The verified communication record supports the reported integrity concern.',
        'EXTERNAL_REFERRAL',
        TIMESTAMP '2026-08-26 09:45:00',
        'ACCEPTED',
        v_manager_id,
        TIMESTAMP '2026-08-26 14:10:00',
        'Finding accepted and external referral approved.',
        0
    );


    ----------------------------------------------------------------
    -- 10. CASE D
    --
    -- CLOSED historical case.
    -- Assignment remains as historical responsibility.
    -- Cursor must NOT move this assignment.
    ----------------------------------------------------------------
    INSERT INTO case_record (
        status,
        involvement_type,
        date_opened,
        referral_status,
        referred_to_authority
    )
    VALUES (
        'CLOSED',
        'Associated Player',
        DATE '2026-07-28',
        'NOT_REFERRED',
        NULL
    )
    RETURNING case_id INTO v_case_d;


    INSERT INTO involves_in (
        person_id,
        case_id
    )
    VALUES (
        100004,
        v_case_d
    );


    INSERT INTO investigates (
        person_id,
        case_id,
        admin_id
    )
    VALUES (
        100004,
        v_case_d,
        v_ayesha_id
    );


    INSERT INTO violates (
        case_id,
        rule_id
    )
    VALUES (
        v_case_d,
        4
    );


    INSERT INTO evidence (
        case_id,
        evidence_no,
        description,
        collected_date
    )
    VALUES (
        v_case_d,
        1,
        'Final review note confirming closure of the investigation.',
        DATE '2026-08-02'
    );


    INSERT INTO investigation_finding (
        person_id,
        case_id,
        submitted_by_admin_id,
        conclusion,
        finding_description,
        recommendation,
        submitted_at,
        review_status,
        reviewed_by_admin_id,
        reviewed_at,
        manager_comment,
        is_deleted
    )
    VALUES (
        100004,
        v_case_d,
        v_ayesha_id,
        'NOT_SUBSTANTIATED',
        'Available evidence did not substantiate the original allegation.',
        'NO_ACTION',
        TIMESTAMP '2026-08-03 11:20:00',
        'ACCEPTED',
        v_manager_id,
        TIMESTAMP '2026-08-03 15:00:00',
        'Accepted. No further integrity action is required.',
        0
    );


    ----------------------------------------------------------------
    -- 11. EXISTING REZAUL FINDING VARIATION
    --
    -- Gives the real Investigator dashboard meaningful review states.
    ----------------------------------------------------------------

    -- Case 1 / Rafiul:
    -- awaiting Manager review.
    INSERT INTO investigation_finding (
        person_id,
        case_id,
        submitted_by_admin_id,
        conclusion,
        finding_description,
        recommendation,
        submitted_at,
        review_status,
        is_deleted
    )
    VALUES (
        100002,
        1,
        v_rezaul_id,
        'INCONCLUSIVE',
        'Current evidence is insufficient to establish the allegation with confidence.',
        'FURTHER_INVESTIGATION',
        TIMESTAMP '2026-08-27 10:00:00',
        'PENDING',
        0
    );


    -- Case 2 / Farzana:
    -- Manager has requested revision.
    INSERT INTO investigation_finding (
        person_id,
        case_id,
        submitted_by_admin_id,
        conclusion,
        finding_description,
        recommendation,
        submitted_at,
        review_status,
        reviewed_by_admin_id,
        reviewed_at,
        manager_comment,
        is_deleted
    )
    VALUES (
        100004,
        2,
        v_rezaul_id,
        'INCONCLUSIVE',
        'The interviews indicate conflicting accounts of the reported conduct.',
        'FURTHER_INVESTIGATION',
        TIMESTAMP '2026-08-28 12:15:00',
        'REVISION_REQUESTED',
        v_manager_id,
        TIMESTAMP '2026-08-29 11:30:00',
        'Clarify the interview timeline and review the second evidence item.',
        0
    );


    -- Case 6 / Sajid:
    -- completed and accepted finding.
    INSERT INTO investigation_finding (
        person_id,
        case_id,
        submitted_by_admin_id,
        conclusion,
        finding_description,
        recommendation,
        submitted_at,
        review_status,
        reviewed_by_admin_id,
        reviewed_at,
        manager_comment,
        is_deleted
    )
    VALUES (
        100008,
        6,
        v_rezaul_id,
        'NOT_SUBSTANTIATED',
        'The available security information does not substantiate the allegation against this player.',
        'NO_ACTION',
        TIMESTAMP '2026-08-20 09:00:00',
        'ACCEPTED',
        v_manager_id,
        TIMESTAMP '2026-08-20 13:20:00',
        'Accepted. Continue normal case administration.',
        0
    );


    ----------------------------------------------------------------
    -- Commit demo expansion.
    ----------------------------------------------------------------
    COMMIT;


    ----------------------------------------------------------------
    -- Useful output when SERVEROUTPUT is enabled.
    ----------------------------------------------------------------
    DBMS_OUTPUT.PUT_LINE(
        'Ayesha Rahman investigator ID: ' || v_ayesha_id
    );

    DBMS_OUTPUT.PUT_LINE(
        'Mahmudul Karim investigator ID: ' || v_mahmud_id
    );

    DBMS_OUTPUT.PUT_LINE(
        'Tasnim Ahmed investigator ID: ' || v_tasnim_id
    );

    DBMS_OUTPUT.PUT_LINE(
        'Demo Case A: ' || v_case_a
    );

    DBMS_OUTPUT.PUT_LINE(
        'Demo Case B: ' || v_case_b
    );

    DBMS_OUTPUT.PUT_LINE(
        'Demo Case C: ' || v_case_c
    );

    DBMS_OUTPUT.PUT_LINE(
        'Demo Case D: ' || v_case_d
    );

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/