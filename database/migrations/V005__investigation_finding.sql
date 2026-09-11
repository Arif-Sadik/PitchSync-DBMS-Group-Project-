CREATE TABLE investigation_finding (
    person_id               NUMBER(10),
    case_id                 NUMBER(10),

    submitted_by_admin_id   NUMBER(10) NOT NULL,

    conclusion              VARCHAR2(30) NOT NULL,
    finding_description     VARCHAR2(2000) NOT NULL,
    recommendation          VARCHAR2(30) NOT NULL,

    submitted_at            TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,

    review_status           VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
    reviewed_by_admin_id    NUMBER(10),
    reviewed_at             TIMESTAMP,
    manager_comment         VARCHAR2(1000),

    is_deleted              NUMBER(1) DEFAULT 0 NOT NULL,

    CONSTRAINT pk_investigation_finding
        PRIMARY KEY (person_id, case_id),

    CONSTRAINT fk_if_investigation
        FOREIGN KEY (person_id, case_id)
        REFERENCES investigates(person_id, case_id),

    CONSTRAINT fk_if_submitted_by
        FOREIGN KEY (submitted_by_admin_id)
        REFERENCES admin(person_id),

    CONSTRAINT fk_if_reviewed_by
        FOREIGN KEY (reviewed_by_admin_id)
        REFERENCES admin(person_id)
);