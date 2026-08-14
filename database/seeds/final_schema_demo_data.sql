/*
  Exactly five presentation rows for every finalized PitchSync table.
  Run only after V001__create_final_schema.sql succeeds in an empty schema.
  Recognizable player names are public presentation labels only. All dates,
  contact details, roles, relationships, achievements, and statistics are
  academic seed values and are not claims about the named players.
*/

INSERT INTO person (person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES (1, 'Shakib', 'Al Hasan', DATE '2001-03-12', 'Mirpur, Dhaka', 'Sonadanga, Khulna');
INSERT INTO person (person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES (2, 'Tamim', 'Iqbal', DATE '2002-07-21', 'Panchlaish, Chattogram', 'Uttara, Dhaka');
INSERT INTO person (person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES (3, 'Mushfiqur', 'Rahim', DATE '2000-11-05', 'Boalia, Rajshahi', 'Zindabazar, Sylhet');
INSERT INTO person (person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES (4, 'Litton', 'Das', DATE '2003-01-18', 'Zindabazar, Sylhet', 'Sadar Road, Barishal');
INSERT INTO person (person_id, first_name, last_name, dob, present_address, permanent_address)
VALUES (5, 'Taskin', 'Ahmed', DATE '1999-09-30', 'Modern Mor, Rangpur', 'Dhanmondi, Dhaka');

INSERT INTO team (team_id, team_name, category, franchise_owner)
VALUES (101, 'Dhaka Comets', 'FRANCHISE', 'Bengal Sports Group');
INSERT INTO team (team_id, team_name, category, franchise_owner)
VALUES (102, 'Chattogram Waves', 'FRANCHISE', 'Coastal Holdings');
INSERT INTO team (team_id, team_name, category, franchise_owner)
VALUES (103, 'Rajshahi Falcons', 'DOMESTIC', NULL);
INSERT INTO team (team_id, team_name, category, franchise_owner)
VALUES (104, 'Sylhet Sparks', 'DOMESTIC', NULL);
INSERT INTO team (team_id, team_name, category, franchise_owner)
VALUES (105, 'Rangpur Meteors', 'ACADEMY', 'Northern Sports Academy');

INSERT INTO tournament (tournament_id, tournament_name, tournament_tier_level)
VALUES (201, 'National Premier T20 Cup', 'FRANCHISE');
INSERT INTO tournament (tournament_id, tournament_name, tournament_tier_level)
VALUES (202, 'National One-Day Championship', 'DOMESTIC');
INSERT INTO tournament (tournament_id, tournament_name, tournament_tier_level)
VALUES (203, 'University Cricket Championship', 'UNIVERSITY');
INSERT INTO tournament (tournament_id, tournament_name, tournament_tier_level)
VALUES (204, 'Emerging Players Cup', 'ACADEMY');
INSERT INTO tournament (tournament_id, tournament_name, tournament_tier_level)
VALUES (205, 'International Cricket Series', 'INTERNATIONAL');

INSERT INTO integrity_case (case_id, status, date_opened)
VALUES (501, 'ROUTINE_REVIEW', DATE '2026-07-01');
INSERT INTO integrity_case (case_id, status, date_opened)
VALUES (502, 'OPEN_REVIEW', DATE '2026-07-05');
INSERT INTO integrity_case (case_id, status, date_opened)
VALUES (503, 'COMPLETED_REVIEW', DATE '2026-06-12');
INSERT INTO integrity_case (case_id, status, date_opened)
VALUES (504, 'OPEN_REVIEW', DATE '2026-07-18');
INSERT INTO integrity_case (case_id, status, date_opened)
VALUES (505, 'ROUTINE_REVIEW', DATE '2026-07-25');

INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (401, 'REC-01', 'RECORD_REVIEW');
INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (402, 'TEAM-02', 'TEAM_PROCEDURE');
INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (403, 'MATCH-03', 'MATCH_DOCUMENTATION');
INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (404, 'COMM-04', 'COMMUNICATION_GUIDANCE');
INSERT INTO rulebook (rule_id, clause_no, category)
VALUES (405, 'ADMIN-05', 'ADMIN_PROCESS');

INSERT INTO complaint (complaint_id, source_type, date_received, description)
VALUES (601, 'EMAIL', DATE '2026-06-29', 'Operational note requesting routine match-record review.');
INSERT INTO complaint (complaint_id, source_type, date_received, description)
VALUES (602, 'HOTLINE', DATE '2026-06-30', 'Follow-up note regarding the documentation workflow.');
INSERT INTO complaint (complaint_id, source_type, date_received, description)
VALUES (603, 'WRITTEN', DATE '2026-07-04', 'Team registration document submitted for routine review.');
INSERT INTO complaint (complaint_id, source_type, date_received, description)
VALUES (604, 'INTERNAL_REPORT', DATE '2026-06-10', 'Player record verification request submitted by operations.');
INSERT INTO complaint (complaint_id, source_type, date_received, description)
VALUES (605, 'EMAIL', DATE '2026-07-17', 'Administrative process query regarding record approval.');

INSERT INTO player (person_id, player_role, gender, education, family_background)
VALUES (1, 'BATTER', 'MALE', 'National Sports Institute', 'Private details not recorded.');
INSERT INTO player (person_id, player_role, gender, education, family_background)
VALUES (2, 'BOWLER', 'FEMALE', 'Coastal City College', 'Private details not recorded.');
INSERT INTO player (person_id, player_role, gender, education, family_background)
VALUES (3, 'ALL_ROUNDER', 'MALE', 'Central Athletics Institute', 'Private details not recorded.');
INSERT INTO player (person_id, player_role, gender, education, family_background)
VALUES (4, 'WICKET_KEEPER', 'FEMALE', 'Eastern Cricket Academy', 'Private details not recorded.');
INSERT INTO player (person_id, player_role, gender, education, family_background)
VALUES (5, 'ALL_ROUNDER', 'MALE', 'Metropolitan Sports School', 'Private details not recorded.');

INSERT INTO admin (person_id, designation, department, email, joining_date)
VALUES (1, 'Match Reviewer', 'Integrity', 'operations01@pitchsync.invalid', DATE '2024-01-10');
INSERT INTO admin (person_id, designation, department, email, joining_date)
VALUES (2, 'Data Officer', 'Performance', 'records02@pitchsync.invalid', DATE '2024-02-12');
INSERT INTO admin (person_id, designation, department, email, joining_date)
VALUES (3, 'Case Coordinator', 'Integrity', 'integrity03@pitchsync.invalid', DATE '2024-03-14');
INSERT INTO admin (person_id, designation, department, email, joining_date)
VALUES (4, 'Tournament Officer', 'Operations', 'tournaments04@pitchsync.invalid', DATE '2024-04-16');
INSERT INTO admin (person_id, designation, department, email, joining_date)
VALUES (5, 'Records Officer', 'Performance', 'performance05@pitchsync.invalid', DATE '2024-05-18');

INSERT INTO person_phone (person_id, phone) VALUES (1, '01700000001');
INSERT INTO person_phone (person_id, phone) VALUES (2, '01700000002');
INSERT INTO person_phone (person_id, phone) VALUES (3, '01700000003');
INSERT INTO person_phone (person_id, phone) VALUES (4, '01700000004');
INSERT INTO person_phone (person_id, phone) VALUES (5, '01700000005');

INSERT INTO player_achievement (person_id, achievement)
VALUES (1, 'Leading Run Scorer');
INSERT INTO player_achievement (person_id, achievement)
VALUES (2, 'Best Bowling Performance');
INSERT INTO player_achievement (person_id, achievement)
VALUES (3, 'Player of the Tournament');
INSERT INTO player_achievement (person_id, achievement)
VALUES (4, 'Best Wicketkeeping Performance');
INSERT INTO player_achievement (person_id, achievement)
VALUES (5, 'Emerging Player Award');

INSERT INTO tournament_sponsor (tournament_id, sponsor)
VALUES (201, 'Padma Telecom');
INSERT INTO tournament_sponsor (tournament_id, sponsor)
VALUES (202, 'Bengal Finance');
INSERT INTO tournament_sponsor (tournament_id, sponsor)
VALUES (203, 'University Sports Club');
INSERT INTO tournament_sponsor (tournament_id, sponsor)
VALUES (204, 'Greenfield Foods');
INSERT INTO tournament_sponsor (tournament_id, sponsor)
VALUES (205, 'Delta Aviation');

INSERT INTO match (match_id, tournament_id, match_date, venue)
VALUES (301, 201, DATE '2026-08-01', 'Mirpur Cricket Ground');
INSERT INTO match (match_id, tournament_id, match_date, venue)
VALUES (302, 202, DATE '2026-08-03', 'Agrabad Sports Complex');
INSERT INTO match (match_id, tournament_id, match_date, venue)
VALUES (303, 203, DATE '2026-08-05', 'University Central Field');
INSERT INTO match (match_id, tournament_id, match_date, venue)
VALUES (304, 204, DATE '2026-08-07', 'Sylhet Cricket Ground');
INSERT INTO match (match_id, tournament_id, match_date, venue)
VALUES (305, 205, DATE '2026-08-09', 'National Cricket Arena');

INSERT INTO career_record
    (record_id, person_id, tier_level, location_type, matches_played, start_date, end_date)
VALUES (701, 1, 'FRANCHISE', 'HOME', 42, DATE '2022-01-01', NULL);
INSERT INTO career_record
    (record_id, person_id, tier_level, location_type, matches_played, start_date, end_date)
VALUES (702, 2, 'DOMESTIC', 'HOME', 36, DATE '2022-06-01', NULL);
INSERT INTO career_record
    (record_id, person_id, tier_level, location_type, matches_played, start_date, end_date)
VALUES (703, 3, 'UNIVERSITY', 'HOME', 28, DATE '2023-01-15', NULL);
INSERT INTO career_record
    (record_id, person_id, tier_level, location_type, matches_played, start_date, end_date)
VALUES (704, 4, 'ACADEMY', 'HOME', 24, DATE '2023-07-01', NULL);
INSERT INTO career_record
    (record_id, person_id, tier_level, location_type, matches_played, start_date, end_date)
VALUES (705, 5, 'INTERNATIONAL', 'AWAY', 50, DATE '2021-03-01', NULL);

INSERT INTO plays_for (person_id, team_id) VALUES (1, 101);
INSERT INTO plays_for (person_id, team_id) VALUES (2, 102);
INSERT INTO plays_for (person_id, team_id) VALUES (3, 103);
INSERT INTO plays_for (person_id, team_id) VALUES (4, 104);
INSERT INTO plays_for (person_id, team_id) VALUES (5, 105);

INSERT INTO mentors (junior_id, mentor_id, mentor_since)
VALUES (1, 2, DATE '2025-01-01');
INSERT INTO mentors (junior_id, mentor_id, mentor_since)
VALUES (2, 3, DATE '2025-01-15');
INSERT INTO mentors (junior_id, mentor_id, mentor_since)
VALUES (3, 4, DATE '2025-02-01');
INSERT INTO mentors (junior_id, mentor_id, mentor_since)
VALUES (4, 5, DATE '2025-02-15');
INSERT INTO mentors (junior_id, mentor_id, mentor_since)
VALUES (5, 1, DATE '2025-03-01');

INSERT INTO observes (admin_id, player_id, match_id, observation_date, remarks)
VALUES (1, 2, 301, DATE '2026-08-01', 'Reviewed bowling consistency during the match.');
INSERT INTO observes (admin_id, player_id, match_id, observation_date, remarks)
VALUES (2, 3, 302, DATE '2026-08-03', 'Reviewed overall batting and bowling contribution.');
INSERT INTO observes (admin_id, player_id, match_id, observation_date, remarks)
VALUES (3, 4, 303, DATE '2026-08-05', 'Reviewed wicketkeeping technique.');
INSERT INTO observes (admin_id, player_id, match_id, observation_date, remarks)
VALUES (4, 5, 304, DATE '2026-08-07', 'Reviewed all-round performance.');
INSERT INTO observes (admin_id, player_id, match_id, observation_date, remarks)
VALUES (5, 1, 305, DATE '2026-08-09', 'Reviewed batting approach and shot selection.');

INSERT INTO batting_summary
    (bat_summary_id, record_id, total_runs, batting_avg, strike_rate, highest_score, format)
VALUES (801, 701, 1250, 41.67, 138.40, 104, 'T20');
INSERT INTO batting_summary
    (bat_summary_id, record_id, total_runs, batting_avg, strike_rate, highest_score, format)
VALUES (802, 702, 420, 18.26, 92.10, 48, 'ODI');
INSERT INTO batting_summary
    (bat_summary_id, record_id, total_runs, batting_avg, strike_rate, highest_score, format)
VALUES (803, 703, 980, 35.00, 126.50, 87, 'T20');
INSERT INTO batting_summary
    (bat_summary_id, record_id, total_runs, batting_avg, strike_rate, highest_score, format)
VALUES (804, 704, 610, 30.50, 111.20, 66, 'T20');
INSERT INTO batting_summary
    (bat_summary_id, record_id, total_runs, batting_avg, strike_rate, highest_score, format)
VALUES (805, 705, 1640, 45.56, 132.75, 118, 'ODI');

INSERT INTO bowling_summary
    (bowl_summary_id, record_id, total_wickets, bowling_avg, best_bowling_figures, format)
VALUES (901, 701, 12, 29.50, '3/24', 'T20');
INSERT INTO bowling_summary
    (bowl_summary_id, record_id, total_wickets, bowling_avg, best_bowling_figures, format)
VALUES (902, 702, 68, 21.40, '5/31', 'ODI');
INSERT INTO bowling_summary
    (bowl_summary_id, record_id, total_wickets, bowling_avg, best_bowling_figures, format)
VALUES (903, 703, 45, 24.75, '4/19', 'T20');
INSERT INTO bowling_summary
    (bowl_summary_id, record_id, total_wickets, bowling_avg, best_bowling_figures, format)
VALUES (904, 704, 5, 33.20, '2/28', 'T20');
INSERT INTO bowling_summary
    (bowl_summary_id, record_id, total_wickets, bowling_avg, best_bowling_figures, format)
VALUES (905, 705, 82, 20.15, '6/27', 'ODI');

INSERT INTO fielding_summary
    (field_summary_id, record_id, total_catches, total_stumpings, total_runouts,
     most_dismissals_in_match, format)
VALUES (1001, 701, 24, 0, 4, '3 catches', 'T20');
INSERT INTO fielding_summary
    (field_summary_id, record_id, total_catches, total_stumpings, total_runouts,
     most_dismissals_in_match, format)
VALUES (1002, 702, 18, 0, 3, '2 catches', 'ODI');
INSERT INTO fielding_summary
    (field_summary_id, record_id, total_catches, total_stumpings, total_runouts,
     most_dismissals_in_match, format)
VALUES (1003, 703, 21, 0, 5, '3 catches', 'T20');
INSERT INTO fielding_summary
    (field_summary_id, record_id, total_catches, total_stumpings, total_runouts,
     most_dismissals_in_match, format)
VALUES (1004, 704, 32, 14, 2, '5 dismissals', 'T20');
INSERT INTO fielding_summary
    (field_summary_id, record_id, total_catches, total_stumpings, total_runouts,
     most_dismissals_in_match, format)
VALUES (1005, 705, 40, 0, 7, '4 catches', 'ODI');

INSERT INTO batting_performance
    (bat_stat_id, bat_summary_id, match_id, runs_scored, balls_faced, strike_rate, dismissals_type)
VALUES (1101, 801, 301, 72, 48, 150.00, 'CAUGHT');
INSERT INTO batting_performance
    (bat_stat_id, bat_summary_id, match_id, runs_scored, balls_faced, strike_rate, dismissals_type)
VALUES (1102, 802, 302, 24, 31, 77.42, 'BOWLED');
INSERT INTO batting_performance
    (bat_stat_id, bat_summary_id, match_id, runs_scored, balls_faced, strike_rate, dismissals_type)
VALUES (1103, 803, 303, 61, 44, 138.64, 'RUN_OUT');
INSERT INTO batting_performance
    (bat_stat_id, bat_summary_id, match_id, runs_scored, balls_faced, strike_rate, dismissals_type)
VALUES (1104, 804, 304, 39, 35, 111.43, 'CAUGHT');
INSERT INTO batting_performance
    (bat_stat_id, bat_summary_id, match_id, runs_scored, balls_faced, strike_rate, dismissals_type)
VALUES (1105, 805, 305, 88, 67, 131.34, 'NOT_OUT');

INSERT INTO bowling_performance
    (bowl_stat_id, bowl_summary_id, match_id, wickets_taken, overs_bowled, runs_conceded, economy_rate)
VALUES (1201, 901, 301, 1, 3.0, 26, 8.67);
INSERT INTO bowling_performance
    (bowl_stat_id, bowl_summary_id, match_id, wickets_taken, overs_bowled, runs_conceded, economy_rate)
VALUES (1202, 902, 302, 4, 8.0, 31, 3.88);
INSERT INTO bowling_performance
    (bowl_stat_id, bowl_summary_id, match_id, wickets_taken, overs_bowled, runs_conceded, economy_rate)
VALUES (1203, 903, 303, 3, 4.0, 22, 5.50);
INSERT INTO bowling_performance
    (bowl_stat_id, bowl_summary_id, match_id, wickets_taken, overs_bowled, runs_conceded, economy_rate)
VALUES (1204, 904, 304, 1, 2.0, 18, 9.00);
INSERT INTO bowling_performance
    (bowl_stat_id, bowl_summary_id, match_id, wickets_taken, overs_bowled, runs_conceded, economy_rate)
VALUES (1205, 905, 305, 5, 9.0, 34, 3.78);

INSERT INTO fielding_performance
    (field_stat_id, field_summary_id, match_id, catches, stumpings, runs_out_direct, byes_conceded)
VALUES (1301, 1001, 301, 2, 0, 0, 0);
INSERT INTO fielding_performance
    (field_stat_id, field_summary_id, match_id, catches, stumpings, runs_out_direct, byes_conceded)
VALUES (1302, 1002, 302, 1, 0, 1, 0);
INSERT INTO fielding_performance
    (field_stat_id, field_summary_id, match_id, catches, stumpings, runs_out_direct, byes_conceded)
VALUES (1303, 1003, 303, 2, 0, 1, 0);
INSERT INTO fielding_performance
    (field_stat_id, field_summary_id, match_id, catches, stumpings, runs_out_direct, byes_conceded)
VALUES (1304, 1004, 304, 3, 2, 0, 1);
INSERT INTO fielding_performance
    (field_stat_id, field_summary_id, match_id, catches, stumpings, runs_out_direct, byes_conceded)
VALUES (1305, 1005, 305, 2, 0, 2, 0);

INSERT INTO violates (case_id, rule_id) VALUES (501, 403);
INSERT INTO violates (case_id, rule_id) VALUES (502, 402);
INSERT INTO violates (case_id, rule_id) VALUES (503, 401);
INSERT INTO violates (case_id, rule_id) VALUES (504, 405);
INSERT INTO violates (case_id, rule_id) VALUES (505, 404);

INSERT INTO source_of (case_id, complaint_id) VALUES (501, 601);
INSERT INTO source_of (case_id, complaint_id) VALUES (501, 602);
INSERT INTO source_of (case_id, complaint_id) VALUES (502, 603);
INSERT INTO source_of (case_id, complaint_id) VALUES (503, 604);
INSERT INTO source_of (case_id, complaint_id) VALUES (504, 605);

INSERT INTO evidence (case_id, evidence_no, description, collected_date)
VALUES (501, 1, 'Match score sheet submitted for record verification.', DATE '2026-07-02');
INSERT INTO evidence (case_id, evidence_no, description, collected_date)
VALUES (501, 2, 'Communication log attached to the workflow review.', DATE '2026-07-03');
INSERT INTO evidence (case_id, evidence_no, description, collected_date)
VALUES (502, 1, 'Team meeting minutes submitted for documentation review.', DATE '2026-07-06');
INSERT INTO evidence (case_id, evidence_no, description, collected_date)
VALUES (503, 1, 'Match footage reference added for record confirmation.', DATE '2026-06-13');
INSERT INTO evidence (case_id, evidence_no, description, collected_date)
VALUES (504, 1, 'Administrative approval form attached to the case.', DATE '2026-07-19');

INSERT INTO involves_in (person_id, case_id, investigation_type)
VALUES (1, 501, 'RECORD_CONFIRMATION');
INSERT INTO involves_in (person_id, case_id, investigation_type)
VALUES (2, 502, 'TEAM_RECORD_REVIEW');
INSERT INTO involves_in (person_id, case_id, investigation_type)
VALUES (3, 503, 'MATCH_DATA_REVIEW');
INSERT INTO involves_in (person_id, case_id, investigation_type)
VALUES (4, 504, 'PROCESS_REVIEW');
INSERT INTO involves_in (person_id, case_id, investigation_type)
VALUES (5, 505, 'COMMUNICATION_REVIEW');

INSERT INTO investigates (person_id, case_id) VALUES (1, 502);
INSERT INTO investigates (person_id, case_id) VALUES (2, 503);
INSERT INTO investigates (person_id, case_id) VALUES (3, 504);
INSERT INTO investigates (person_id, case_id) VALUES (4, 505);
INSERT INTO investigates (person_id, case_id) VALUES (5, 501);

INSERT INTO includes (match_id, team_id) VALUES (301, 101);
INSERT INTO includes (match_id, team_id) VALUES (301, 102);
INSERT INTO includes (match_id, team_id) VALUES (302, 103);
INSERT INTO includes (match_id, team_id) VALUES (303, 104);
INSERT INTO includes (match_id, team_id) VALUES (304, 105);

INSERT INTO investigates_aggregated (admin_id, person_id, case_id)
VALUES (1, 2, 501);
INSERT INTO investigates_aggregated (admin_id, person_id, case_id)
VALUES (2, 3, 502);
INSERT INTO investigates_aggregated (admin_id, person_id, case_id)
VALUES (3, 4, 503);
INSERT INTO investigates_aggregated (admin_id, person_id, case_id)
VALUES (4, 5, 504);
INSERT INTO investigates_aggregated (admin_id, person_id, case_id)
VALUES (5, 1, 505);

COMMIT;
