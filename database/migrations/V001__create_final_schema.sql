/*
  PitchSync finalized Oracle schema
  Source: docs & assets/Schema_Updated.png
  Approved naming correction: CASE -> INTEGRITY_CASE
  Target: Oracle Database 19c (kept compatible with 12c where practical)
*/

CREATE TABLE person (
    person_id          NUMBER(10),
    first_name         VARCHAR2(50) NOT NULL,
    last_name          VARCHAR2(50) NOT NULL,
    dob                DATE,
    present_address    VARCHAR2(255),
    permanent_address  VARCHAR2(255),

    CONSTRAINT pk_person PRIMARY KEY (person_id)
);

CREATE TABLE team (
    team_id           NUMBER(10),
    team_name         VARCHAR2(100) NOT NULL,
    category          VARCHAR2(50) NOT NULL,
    franchise_owner   VARCHAR2(100),

    CONSTRAINT pk_team PRIMARY KEY (team_id),
    CONSTRAINT uq_team_name UNIQUE (team_name)
);

CREATE TABLE tournament (
    tournament_id          NUMBER(10),
    tournament_name        VARCHAR2(100) NOT NULL,
    tournament_tier_level  VARCHAR2(20) NOT NULL,

    CONSTRAINT pk_tournament PRIMARY KEY (tournament_id)
);

CREATE TABLE integrity_case (
    case_id      NUMBER(10),
    status       VARCHAR2(30) NOT NULL,
    date_opened  DATE NOT NULL,

    CONSTRAINT pk_integrity_case PRIMARY KEY (case_id)
);

CREATE TABLE rulebook (
    rule_id    NUMBER(10),
    clause_no  VARCHAR2(20) NOT NULL,
    category   VARCHAR2(50) NOT NULL,

    CONSTRAINT pk_rulebook PRIMARY KEY (rule_id),
    CONSTRAINT uq_rulebook_clause UNIQUE (category, clause_no)
);

CREATE TABLE complaint (
    complaint_id  NUMBER(10),
    source_type   VARCHAR2(50) NOT NULL,
    date_received DATE NOT NULL,
    description   VARCHAR2(2000) NOT NULL,

    CONSTRAINT pk_complaint PRIMARY KEY (complaint_id)
);

CREATE TABLE player (
    person_id         NUMBER(10),
    player_role       VARCHAR2(50) NOT NULL,
    gender            VARCHAR2(10) NOT NULL,
    education         VARCHAR2(100),
    family_background VARCHAR2(2000),

    CONSTRAINT pk_player PRIMARY KEY (person_id),
    CONSTRAINT fk_player_person FOREIGN KEY (person_id)
        REFERENCES person(person_id),
    CONSTRAINT ck_player_gender CHECK (gender IN ('MALE', 'FEMALE'))
);

CREATE TABLE admin (
    person_id     NUMBER(10),
    designation   VARCHAR2(50) NOT NULL,
    department    VARCHAR2(50) NOT NULL,
    email         VARCHAR2(100) NOT NULL,
    joining_date  DATE NOT NULL,

    CONSTRAINT pk_admin PRIMARY KEY (person_id),
    CONSTRAINT fk_admin_person FOREIGN KEY (person_id)
        REFERENCES person(person_id),
    CONSTRAINT uq_admin_email UNIQUE (email)
);

CREATE TABLE person_phone (
    person_id  NUMBER(10),
    phone      VARCHAR2(20),

    CONSTRAINT pk_person_phone PRIMARY KEY (person_id, phone),
    CONSTRAINT fk_person_phone_person FOREIGN KEY (person_id)
        REFERENCES person(person_id)
);

CREATE TABLE player_achievement (
    person_id    NUMBER(10),
    achievement  VARCHAR2(255),

    CONSTRAINT pk_player_achievement PRIMARY KEY (person_id, achievement),
    CONSTRAINT fk_achievement_player FOREIGN KEY (person_id)
        REFERENCES player(person_id)
);

CREATE TABLE tournament_sponsor (
    tournament_id  NUMBER(10),
    sponsor        VARCHAR2(100),

    CONSTRAINT pk_tournament_sponsor PRIMARY KEY (tournament_id, sponsor),
    CONSTRAINT fk_sponsor_tournament FOREIGN KEY (tournament_id)
        REFERENCES tournament(tournament_id)
);

CREATE TABLE match (
    match_id       NUMBER(10),
    tournament_id  NUMBER(10) NOT NULL,
    match_date     DATE NOT NULL,
    venue          VARCHAR2(100) NOT NULL,

    CONSTRAINT pk_match PRIMARY KEY (match_id),
    CONSTRAINT fk_match_tournament FOREIGN KEY (tournament_id)
        REFERENCES tournament(tournament_id)
);

CREATE TABLE career_record (
    record_id       NUMBER(10),
    person_id       NUMBER(10) NOT NULL,
    tier_level      VARCHAR2(20) NOT NULL,
    location_type   VARCHAR2(20) NOT NULL,
    matches_played  NUMBER(10) NOT NULL,
    start_date      DATE NOT NULL,
    end_date        DATE,

    CONSTRAINT pk_career_record PRIMARY KEY (record_id),
    CONSTRAINT fk_career_player FOREIGN KEY (person_id)
        REFERENCES player(person_id),
    CONSTRAINT ck_career_matches CHECK (matches_played >= 0),
    CONSTRAINT ck_career_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE plays_for (
    person_id  NUMBER(10),
    team_id    NUMBER(10),

    CONSTRAINT pk_plays_for PRIMARY KEY (person_id, team_id),
    CONSTRAINT fk_plays_for_player FOREIGN KEY (person_id)
        REFERENCES player(person_id),
    CONSTRAINT fk_plays_for_team FOREIGN KEY (team_id)
        REFERENCES team(team_id)
);

CREATE TABLE mentors (
    junior_id     NUMBER(10),
    mentor_id     NUMBER(10) NOT NULL,
    mentor_since  DATE NOT NULL,

    CONSTRAINT pk_mentors PRIMARY KEY (junior_id),
    CONSTRAINT fk_mentors_junior FOREIGN KEY (junior_id)
        REFERENCES player(person_id),
    CONSTRAINT fk_mentors_mentor FOREIGN KEY (mentor_id)
        REFERENCES player(person_id),
    CONSTRAINT ck_mentors_distinct CHECK (junior_id <> mentor_id)
);

CREATE TABLE observes (
    admin_id          NUMBER(10),
    player_id         NUMBER(10),
    match_id          NUMBER(10),
    observation_date  DATE,
    remarks           VARCHAR2(2000),

    CONSTRAINT pk_observes PRIMARY KEY
        (admin_id, player_id, match_id, observation_date),
    CONSTRAINT fk_observes_admin FOREIGN KEY (admin_id)
        REFERENCES admin(person_id),
    CONSTRAINT fk_observes_player FOREIGN KEY (player_id)
        REFERENCES player(person_id),
    CONSTRAINT fk_observes_match FOREIGN KEY (match_id)
        REFERENCES match(match_id)
);

CREATE TABLE batting_summary (
    bat_summary_id  NUMBER(10),
    record_id       NUMBER(10) NOT NULL,
    total_runs      NUMBER(10) NOT NULL,
    batting_avg     NUMBER(5,2) NOT NULL,
    strike_rate     NUMBER(5,2) NOT NULL,
    highest_score   NUMBER(10) NOT NULL,
    format          VARCHAR2(20) NOT NULL,

    CONSTRAINT pk_batting_summary PRIMARY KEY (bat_summary_id),
    CONSTRAINT fk_batting_summary_record FOREIGN KEY (record_id)
        REFERENCES career_record(record_id),
    CONSTRAINT ck_batting_summary_values CHECK (
        total_runs >= 0 AND batting_avg >= 0 AND
        strike_rate >= 0 AND highest_score >= 0
    )
);

CREATE TABLE bowling_summary (
    bowl_summary_id      NUMBER(10),
    record_id            NUMBER(10) NOT NULL,
    total_wickets        NUMBER(10) NOT NULL,
    bowling_avg          NUMBER(5,2) NOT NULL,
    best_bowling_figures VARCHAR2(20) NOT NULL,
    format               VARCHAR2(20) NOT NULL,

    CONSTRAINT pk_bowling_summary PRIMARY KEY (bowl_summary_id),
    CONSTRAINT fk_bowling_summary_record FOREIGN KEY (record_id)
        REFERENCES career_record(record_id),
    CONSTRAINT ck_bowling_summary_values CHECK (
        total_wickets >= 0 AND bowling_avg >= 0
    )
);

CREATE TABLE fielding_summary (
    field_summary_id          NUMBER(10),
    record_id                 NUMBER(10) NOT NULL,
    total_catches             NUMBER(10) NOT NULL,
    total_stumpings           NUMBER(10) NOT NULL,
    total_runouts             NUMBER(10) NOT NULL,
    most_dismissals_in_match  VARCHAR2(50) NOT NULL,
    format                    VARCHAR2(20) NOT NULL,

    CONSTRAINT pk_fielding_summary PRIMARY KEY (field_summary_id),
    CONSTRAINT fk_fielding_summary_record FOREIGN KEY (record_id)
        REFERENCES career_record(record_id),
    CONSTRAINT ck_fielding_summary_values CHECK (
        total_catches >= 0 AND total_stumpings >= 0 AND total_runouts >= 0
    )
);

CREATE TABLE batting_performance (
    bat_stat_id     NUMBER(10),
    bat_summary_id  NUMBER(10) NOT NULL,
    match_id        NUMBER(10) NOT NULL,
    runs_scored     NUMBER(10) NOT NULL,
    balls_faced     NUMBER(10) NOT NULL,
    strike_rate     NUMBER(5,2) NOT NULL,
    dismissals_type VARCHAR2(50),

    CONSTRAINT pk_batting_performance PRIMARY KEY (bat_stat_id),
    CONSTRAINT fk_bat_perf_summary FOREIGN KEY (bat_summary_id)
        REFERENCES batting_summary(bat_summary_id),
    CONSTRAINT fk_bat_perf_match FOREIGN KEY (match_id)
        REFERENCES match(match_id),
    CONSTRAINT ck_bat_perf_values CHECK (
        runs_scored >= 0 AND balls_faced >= 0 AND strike_rate >= 0
    )
);

CREATE TABLE bowling_performance (
    bowl_stat_id    NUMBER(10),
    bowl_summary_id NUMBER(10) NOT NULL,
    match_id        NUMBER(10) NOT NULL,
    wickets_taken   NUMBER(10) NOT NULL,
    overs_bowled    NUMBER(4,1) NOT NULL,
    runs_conceded   NUMBER(10) NOT NULL,
    economy_rate    NUMBER(4,2) NOT NULL,

    CONSTRAINT pk_bowling_performance PRIMARY KEY (bowl_stat_id),
    CONSTRAINT fk_bowl_perf_summary FOREIGN KEY (bowl_summary_id)
        REFERENCES bowling_summary(bowl_summary_id),
    CONSTRAINT fk_bowl_perf_match FOREIGN KEY (match_id)
        REFERENCES match(match_id),
    CONSTRAINT ck_bowl_perf_values CHECK (
        wickets_taken >= 0 AND overs_bowled >= 0 AND
        runs_conceded >= 0 AND economy_rate >= 0
    )
);

CREATE TABLE fielding_performance (
    field_stat_id     NUMBER(10),
    field_summary_id  NUMBER(10) NOT NULL,
    match_id          NUMBER(10) NOT NULL,
    catches           NUMBER(10) NOT NULL,
    stumpings         NUMBER(10) NOT NULL,
    runs_out_direct   NUMBER(10) NOT NULL,
    byes_conceded     NUMBER(10) NOT NULL,

    CONSTRAINT pk_fielding_performance PRIMARY KEY (field_stat_id),
    CONSTRAINT fk_field_perf_summary FOREIGN KEY (field_summary_id)
        REFERENCES fielding_summary(field_summary_id),
    CONSTRAINT fk_field_perf_match FOREIGN KEY (match_id)
        REFERENCES match(match_id),
    CONSTRAINT ck_field_perf_values CHECK (
        catches >= 0 AND stumpings >= 0 AND
        runs_out_direct >= 0 AND byes_conceded >= 0
    )
);

CREATE TABLE violates (
    case_id  NUMBER(10),
    rule_id  NUMBER(10),

    CONSTRAINT pk_violates PRIMARY KEY (case_id, rule_id),
    CONSTRAINT fk_violates_case FOREIGN KEY (case_id)
        REFERENCES integrity_case(case_id),
    CONSTRAINT fk_violates_rule FOREIGN KEY (rule_id)
        REFERENCES rulebook(rule_id)
);

CREATE TABLE source_of (
    case_id       NUMBER(10),
    complaint_id  NUMBER(10),

    CONSTRAINT pk_source_of PRIMARY KEY (case_id, complaint_id),
    CONSTRAINT fk_source_of_case FOREIGN KEY (case_id)
        REFERENCES integrity_case(case_id),
    CONSTRAINT fk_source_of_complaint FOREIGN KEY (complaint_id)
        REFERENCES complaint(complaint_id)
);

CREATE TABLE evidence (
    case_id         NUMBER(10),
    evidence_no     NUMBER(10),
    description     VARCHAR2(2000) NOT NULL,
    collected_date  DATE NOT NULL,

    CONSTRAINT pk_evidence PRIMARY KEY (case_id, evidence_no),
    CONSTRAINT fk_evidence_case FOREIGN KEY (case_id)
        REFERENCES integrity_case(case_id)
);

CREATE TABLE involves_in (
    person_id          NUMBER(10),
    case_id            NUMBER(10),
    investigation_type VARCHAR2(50) NOT NULL,

    CONSTRAINT pk_involves_in PRIMARY KEY (person_id, case_id),
    CONSTRAINT fk_involves_person FOREIGN KEY (person_id)
        REFERENCES person(person_id),
    CONSTRAINT fk_involves_case FOREIGN KEY (case_id)
        REFERENCES integrity_case(case_id)
);

CREATE TABLE investigates (
    person_id  NUMBER(10),
    case_id    NUMBER(10),

    CONSTRAINT pk_investigates PRIMARY KEY (person_id, case_id),
    CONSTRAINT fk_investigates_admin FOREIGN KEY (person_id)
        REFERENCES admin(person_id),
    CONSTRAINT fk_investigates_case FOREIGN KEY (case_id)
        REFERENCES integrity_case(case_id)
);

CREATE TABLE includes (
    match_id  NUMBER(10),
    team_id   NUMBER(10),

    CONSTRAINT pk_includes PRIMARY KEY (match_id, team_id),
    CONSTRAINT fk_includes_match FOREIGN KEY (match_id)
        REFERENCES match(match_id),
    CONSTRAINT fk_includes_team FOREIGN KEY (team_id)
        REFERENCES team(team_id)
);

CREATE TABLE investigates_aggregated (
    admin_id   NUMBER(10),
    person_id  NUMBER(10),
    case_id    NUMBER(10),

    CONSTRAINT pk_investigates_agg PRIMARY KEY (admin_id, person_id, case_id),
    CONSTRAINT fk_inv_agg_admin FOREIGN KEY (admin_id)
        REFERENCES admin(person_id),
    CONSTRAINT fk_inv_agg_person FOREIGN KEY (person_id)
        REFERENCES person(person_id),
    CONSTRAINT fk_inv_agg_case FOREIGN KEY (case_id)
        REFERENCES integrity_case(case_id)
);
