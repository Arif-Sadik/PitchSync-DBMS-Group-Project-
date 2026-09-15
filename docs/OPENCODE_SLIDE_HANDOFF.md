# 1. PitchSync in One Paragraph

PitchSync is an academic Oracle Database 19c project for centralized cricket-board administration, competition and performance records, and integrity/compliance case management. Its Next.js web application provides role-specific access to players, teams, tournaments, matches, statistics, complaints, cases, evidence, rulebook clauses, investigators, and findings, while Oracle enforces the core relational rules.

# 2. How the Application Works

The application is a Next.js App Router frontend and server API layer backed by the official `oracledb` driver and Oracle 19c. Browser code calls authenticated `/api/...` route handlers; it never connects to Oracle directly. Route handlers validate input with Zod, enforce signed-session roles, call server-only query modules, and return JSON. Query modules use Oracle bind variables and pooled connections. Multi-statement changes use `withOracleTransaction`, which commits on success and rolls back on error.

Major implemented areas are authentication and role dashboards; player registration, profiles, updates, and soft deletion; teams and rosters; tournaments and matches; player performance/career statistics; and integrity complaints, cases, involved players, investigator assignment, evidence, rules, findings, reports, and officer oversight. The visible role model includes Super Admin, Board Admin, Team Performance Manager, Match Official, Integrity & Compliance Officer, and Player; integrity officers additionally have `MANAGER` or `INVESTIGATOR` scope.

# 3. Database Design Overview

The authoritative core schema is `database/migrations/V003_create_final_schema.sql` (32 tables), extended by `V004__integrity_officer_access.sql` and `V005__investigation_finding.sql` for the implemented integrity workflow.

Important design groups:

- **People and access:** `person` is specialized into `player` and `admin` through shared primary-key/foreign-key relationships. `user_account` links one account to one person. `person_phone`, `player_achievement`, and `player_education` separate multivalued attributes rather than repeating them in the person row.
- **Cricket operations:** `team`, `plays_for` (player-team history), `mentors`, `player_fitness`, `tournament`, `tournament_sponsor`, `match`, and `includes` (match-team participation) model competitions and membership.
- **Performance:** `career_record` has batting, bowling, and fielding summaries; their per-match performance tables link summary records to `match`.
- **Integrity:** `complaint`, `case_record`, `evidence`, and `rulebook` are connected through bridge tables: `source_of` (case-complaint), `involves_in` (case-player), `investigates` (involved player/case-investigator), and `violates` (case-rule). `integrity_officer_access` records officer scope and `investigation_finding` is tied to an investigation assignment. `observes` and `audit_log` support monitoring and application audit history.

The bridge tables use composite keys where the relationship itself must be unique, for example `plays_for(person_id, team_id, start_date)`, `involves_in(person_id, case_id)`, `investigates(person_id, case_id)`, and `violates(case_id, rule_id)`.

# 4. Why PitchSync Is a Proper DBMS Project

- **Relational modelling and normalization — SCHEMA/DESIGN:** distinct tables represent people, specializations, accounts, teams, tournaments, matches, statistics, and integrity objects. Separate phone, achievement, education, sponsorship, and relationship tables avoid repeating groups.
- **Keys and relationships — VERIFIED:** V003 defines primary and foreign keys throughout, including `player.person_id -> person.person_id`, `user_account.person_id -> person.person_id`, performance-to-summary/match links, and integrity bridges. This supplies entity identity and database-enforced parent/child relationships.
- **Domain and business constraints — VERIFIED:** `NOT NULL`, defaults, unique keys (`admin.email`, account username/person, rule clause, tournament/season), and checks exist. Examples include end-date ordering for memberships/career records, distinct mentor/junior, referral-status/authority consistency, and integrity access scope limited to `MANAGER` or `INVESTIGATOR`.
- **CRUD with an application layer — VERIFIED:** server route handlers and query modules list/read/write players, teams, tournaments, matches, complaints, cases, evidence, rules, findings, and accounts. Player writes use `INSERT`, `UPDATE`, `MERGE`, logical delete, and `audit_log`; case creation and investigator assignment call stored procedures.
- **Relational querying and reports — VERIFIED:** the SQL catalogue contains joins, aggregates, filters, dashboards, scorecards, roster queries, leaderboards, case registries, and integrity reports such as frequently violated rules and investigator workload.
- **Security and separation — VERIFIED:** Oracle credentials are server-only environment variables; a pooled Oracle connection is available only in server code. Password hashes are checked with bcrypt, signed HttpOnly session cookies are used, and server routes restrict roles/scopes. Query parameters are bind variables.
- **History and auditability — VERIFIED:** soft-delete flags preserve records in many tables, and player changes insert an application audit record into `audit_log`.

# 5. Advanced Oracle / DBMS Features

- **Sequences and identities — VERIFIED:** explicit sequences allocate player/admin, match, complaint, and case references; e.g. player creation selects `seq_player_person.NEXTVAL`. Many internal IDs use `GENERATED ALWAYS AS IDENTITY`.
- **Triggers — VERIFIED:** `trg_person_dob_valid` rejects future dates of birth; `trg_investigates_admin_role` permits only an `Integrity & Compliance Officer` as investigator.
- **Stored procedures — VERIFIED:** `pr_open_integrity_case` inserts a case, optional complaint link, involved player, and optional assignment; `pr_assign_investigator` validates active involvement/eligible officer, performs a `MERGE`, and transitions an open case to `UNDER_INVESTIGATION`; `pr_reassign_investigator` uses a cursor to transfer active assignments.
- **Function and view — VERIFIED:** `fn_active_assignment_count` counts an officer's active assignments; `vw_assignable_investigators` uses it to expose eligible investigators and workload.
- **PL/SQL cursor and exception examples — VERIFIED AS REPOSITORY SQL DEMONSTRATIONS:** `database/project-update-2/06_cursor.sql` has an explicit roster cursor, and `07_exception_handling.sql` handles `NO_DATA_FOUND`, a custom exception, and `OTHERS`. These are not shown as runtime API calls.
- **Transactions and exception propagation — VERIFIED:** `withOracleTransaction` commits only after the callback succeeds and rolls back any error. Case and player POST routes use it. Oracle procedure errors are mapped to suitable API responses.
- **Indexes — VERIFIED:** `create_indexes.sql` adds lookup/reporting indexes for foreign keys and access patterns, including match/tournament, performance/match, case status, investigation admin, rule violation, and audit entity/record lookup. PK/UNIQUE indexes are Oracle-supported implicitly.
- **Packages — NOT VERIFIED:** no Oracle package implementation was found.

# 6. Integrity and Consistency

**Entity integrity** is supplied by primary keys, including composite bridge keys; identity columns and explicit sequences generate identifiers. **Referential integrity** comes from foreign keys across specializations, operational records, performance, and integrity relationships. **Domain integrity** uses required columns, types, defaults, unique constraints, check constraints, Zod input schemas, and the DOB trigger.

Consistency is strengthened by stored procedures: case opening verifies a non-deleted complaint when provided, and investigator assignment requires an active non-closed involvement plus an investigator from the eligibility view. The investigator trigger independently checks the admin designation. Soft deletion is respected in application queries and procedure checks. Transaction safety is concrete in the server helper: a multi-step operation is committed as a unit or rolled back. No stronger concurrency-control claim is made beyond Oracle transaction handling and the configured connection pool.

# 7. Functional Flow Example

**Open an integrity case with an optional investigator.** The Integrity Manager uses the integrity-case UI, which posts to `POST /api/integrity/cases`. The route checks the signed role/scope, validates `complaintId`, `playerId`, `involvementType`, and optional `investigatorId` with Zod, then starts `withOracleTransaction`. `openIntegrityCase` executes the bind-variable PL/SQL call to `pr_open_integrity_case`.

The procedure checks that an optional complaint is active, inserts `case_record` (using its sequence-backed default), inserts `source_of` if applicable, inserts `involves_in`, and optionally invokes `pr_assign_investigator`. Assignment validates the active involvement and `vw_assignable_investigators`, merges into `investigates`, and changes an open case to `UNDER_INVESTIGATION`; the role trigger supplies an additional database check. The API commits the complete unit and returns the new case ID (HTTP 201), or rolls it back and returns a validated error.

# 8. Verified DBMS Feature Matrix

| DBMS Concept | Status | PitchSync Implementation | Evidence |
| --- | --- | --- | --- |
| Relational schema / normalization | SCHEMA/DESIGN | 32-table core with specialized, multivalued, and bridge tables | `V003_create_final_schema.sql` |
| PKs, FKs, composite bridges | VERIFIED | Relationships and identity for operational and integrity records | V003; V004; V005 |
| NOT NULL, DEFAULT, UNIQUE, CHECK | VERIFIED | Required values, statuses, unique account/rule/tournament data, date/referral rules | V003; V004 |
| Sequences / identity | VERIFIED | Five explicit sequences plus identity-backed internal keys | V003; `player-writes.ts` |
| CRUD and soft delete | VERIFIED | Server APIs and query modules; player audit writes | `src/app/api`; `player-writes.ts` |
| Bind parameters | VERIFIED | User-controlled SQL values passed as Oracle binds | `queryRows`, query modules, `BACKEND_QUERY_GUIDE.md` |
| Joins, aggregation, reporting | VERIFIED | Scorecards, dashboards, standings, workload, case reports | `database/queries/` |
| Transactions | VERIFIED | Commit-on-success / rollback-on-error helper used for writes | `src/lib/db/oracle.ts`; API routes |
| Triggers | VERIFIED | DOB and investigator-designation validation | `database/triggers/` |
| Procedures | VERIFIED | Open, assign, and bulk-reassign investigations | `database/procedures/integrity/` |
| Function / view | VERIFIED | Assignment-count function and assignable-investigator view | `database/functions/`, `database/views/` |
| Explicit indexes | VERIFIED | FK, status, reporting, and audit lookup indexes | `database/indexes/create_indexes.sql` |
| Authentication / authorization | VERIFIED | bcrypt, signed HttpOnly cookies, roles and integrity scopes | `src/app/api/auth`; `src/lib/auth` |
| PL/SQL cursor / exceptions | VERIFIED | Executable course demonstration scripts | `database/project-update-2/06_cursor.sql`, `07_exception_handling.sql` |
| Oracle packages / savepoints | NOT VERIFIED | No implementation found | Repository audit |

# 9. Important Facts for Presentation

- **Name and purpose:** PitchSync centralizes cricket-board operations, performance, competition, and integrity/compliance records.
- **Database and architecture:** Oracle Database 19c; Next.js/React App Router; official `oracledb` driver; server-only pooled Oracle access.
- **Users:** six role-specific application roles, including integrity officers with manager/investigator scope.
- **Core modules:** people/players/accounts, teams and history, tournaments/matches, performance records, complaints/cases/evidence/rules/findings, dashboards and reports.
- **Strong relational story:** person specialization, normalized multivalued attributes, and bridge tables for team history, match participation, cases, investigators, complaints, and violated rules.
- **Strongest advanced implementation:** explicit sequences and identities; two database triggers; integrity procedures; workload function/view; indexes; atomic server transactions; PL/SQL cursor/exception demonstration scripts.
- **Integrity workflow:** an authorized manager opens a case, links a complaint/player, optionally assigns a qualified investigator, and receives one committed result or a rollback.
- **Boundary:** claims should be limited to repository-backed implementation. Oracle packages and savepoints are not evidenced; cursor/exception scripts are demonstrations rather than confirmed runtime APIs.

# 10. FINAL OPENCODE PROMPT

Create a polished, professional academic slide deck (roughly 12–16 slides) for a university DBMS course defense titled **PitchSync: Cricket Board Management and Integrity Monitoring System**. On the title slide, include the team members: Lt. Riddita Binte Rahat; Safatul Jannat Shupti; Md. Arif Sadik Molla; Faisal Ahmed Saad; and Nitun Kundu Swapnil. Use short presentation-friendly bullets, visual hierarchy, diagrams/flowcharts, and minimal paragraphs. Use PitchSync consistently. Do not invent features or present generic DBMS theory without tying it to the verified implementation below.

PitchSync is an Oracle Database 19c-backed Next.js/React academic DBMS project. It centralizes cricket-board administration, players, teams, tournaments, matches, player performance, and integrity/compliance operations. Browser code never connects directly to Oracle: the UI calls authenticated Next.js App Router API routes; server-only query modules use the official `oracledb` driver, a pooled Oracle connection, and bind-variable SQL; JSON results return to the UI. Input is validated with Zod. Authentication checks bcrypt password hashes, uses signed HttpOnly cookies, and server routes enforce six role-specific user experiences: Super Admin, Board Admin, Team Performance Manager, Match Official, Integrity & Compliance Officer, and Player. Integrity officers have `MANAGER` or `INVESTIGATOR` scope.

Show the ER/model overview visually. The authoritative core V003 schema has 32 tables and is extended with integrity officer access and investigation findings. Key entity groups: `person` is specialized into `player` and `admin` via shared PK/FK; `user_account` links accounts to people; `person_phone`, `player_achievement`, and `player_education` normalize multivalued data. Cricket tables include `team`, `plays_for` (player-team history), `mentors`, `player_fitness`, `tournament`, `tournament_sponsor`, `match`, and `includes` (match-team participation). Performance uses `career_record`, batting/bowling/fielding summaries, and per-match performance tables. Integrity uses `complaint`, `case_record`, `evidence`, `rulebook`, `source_of` (case-complaint), `involves_in` (case-player), `investigates` (case/player-investigator), `violates` (case-rule), `integrity_officer_access`, `investigation_finding`, `observes`, and `audit_log`. Highlight composite bridge keys such as `plays_for(person_id, team_id, start_date)`, `involves_in(person_id, case_id)`, `investigates(person_id, case_id)`, and `violates(case_id, rule_id)`.

Explain why it is a real DBMS project with concrete implementation: primary/foreign keys enforce entity and referential integrity; `NOT NULL`, defaults, unique constraints (admin email, username, account-person, rule clause, tournament/season), and checks enforce domain rules. Examples: membership and career end dates cannot precede start dates; mentor and junior must differ; a case's referral status and authority must agree; officer scope is only `MANAGER` or `INVESTIGATOR`. Soft-delete flags preserve historical records and player changes write `audit_log`. Include reports/relational querying: the repository includes joined and aggregated dashboards, scorecards, tournament standings/leaderboards, rosters, case registries, frequently violated rules, and investigator workload reports.

Include verified advanced Oracle features, concisely and accurately: five explicit sequences allocate player/admin, match, complaint, and case references, and many other internal IDs use Oracle `GENERATED ALWAYS AS IDENTITY`. Player creation uses `seq_player_person.NEXTVAL`. Trigger `trg_person_dob_valid` rejects future DOBs; trigger `trg_investigates_admin_role` ensures only an Integrity & Compliance Officer can be assigned as investigator. Stored procedure `pr_open_integrity_case` creates a case, optional complaint source, involved player, and optional investigator. `pr_assign_investigator` validates active/non-closed involvement and eligible investigator, uses `MERGE` to assign/reassign, and changes a new open case to `UNDER_INVESTIGATION`. `pr_reassign_investigator` uses a cursor for bulk reassignment. Function `fn_active_assignment_count` supports view `vw_assignable_investigators`, showing eligible officers and active workload. Explicit indexes support match/tournament, performance/match, case-status, investigation-admin, rule-violation, and audit lookup patterns; PK/UNIQUE constraints also receive Oracle supporting indexes. Include the repository's PL/SQL roster cursor and exception-handling examples only as executable course demonstrations, not as runtime web features. Do not claim Oracle packages or savepoints: they were not verified.

Give special emphasis to integrity, consistency, and the end-to-end case workflow with a diagram: Integrity Manager UI -> `POST /api/integrity/cases` -> signed role/scope check and Zod validation -> `withOracleTransaction` -> bind-variable call to `pr_open_integrity_case` -> `case_record`, optional `source_of`, `involves_in`, optional `investigates` -> commit and new case ID; any error rolls back. The procedure checks an optional complaint is active; assignment checks the eligibility view; the investigator trigger provides a second database validation. The server transaction helper commits only after success and rolls back on errors. Make clear this is the strongest actual application-to-Oracle workflow.

Suggested coherent narrative: title; what PitchSync is and motivation; what it manages and users; architecture/data flow; ER/database overview; important entities and bridges; DBMS fundamentals (keys, normalization, constraints); data integrity; transactions and case workflow; Oracle advanced features; reports/modules; scope/verified boundaries; conclusion. Prefer diagrams for architecture, ER relationships, and case workflow. If an ER image is supplied, place it where appropriate. Ensure the takeaway is that PitchSync demonstrates applied relational database design and Oracle-backed integrity management, not merely a frontend.
