# PitchSync
# 
PitchSync is an internal cricket administration and integrity management interface created for an academic DBMS project. The current repository combines the working Next.js frontend at the repository root with a prepared Express/Node backend and shared Oracle database development structure.

The frontend milestone includes 15 product screens. Backend and database integration are prepared but not complete, and no actual PitchSync schema migration has been created in Git yet.

## Repository Structure

```text
PitchSync/
|-- backend/
|   |-- scripts/
|   |   `-- test-connection.js
|   |-- src/
|   |   |-- config/
|   |   |   `-- database.js
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- app.js
|   |-- .env.example
|   |-- README.md
|   |-- package-lock.json
|   `-- package.json
|-- database/
|   |-- functions/
|   |-- migrations/
|   |-- packages/
|   |-- procedures/
|   |-- reference/
|   |   `-- PitchSync_DDL_Oracle.txt
|   |-- seeds/
|   |-- tests/
|   |-- triggers/
|   |-- views/
|   `-- README.md
|-- docs/
|   |-- PitchSync_Project_Proposal.pdf
|   `-- README.md
|-- src/
|   |-- app/
|   |-- components/
|   |-- config/
|   |-- data/
|   |-- features/
|   |-- hooks/
|   |-- lib/
|   `-- types/
|-- .env.example
|-- .gitignore
|-- components.json
|-- next.config.ts
|-- package-lock.json
|-- package.json
|-- postcss.config.mjs
|-- tsconfig.json
`-- README.md
```

## Architecture

```text
PitchSync frontend (Next.js, repository root)
|
v
Express/Node backend (backend/)
|
v
LTMS_APP
|
v
localhost:1523
|
v
SSH tunnel
|
v
Azure VM
|
v
Oracle Database 12c 12.2.0.1
|
v
ORCLPDB1
```

- The working frontend is the Next.js application at the repository root.
- The backend lives in `backend/` and connects to Oracle through environment variables.
- The backend database account is `LTMS_APP`.
- The Oracle schema owner is `LTMS_OWNER`.
- Backend privileges should be granted through `LTMS_APP_ROLE`.
- Developers use individual `DEV_*` Oracle accounts with proxy access to `LTMS_OWNER` for schema work.
- Do not share `LTMS_OWNER`, `SYSTEM`, or `SYS` passwords.
- The Azure Oracle listener is not exposed publicly.
- Developers connect through SSH tunnels, typically mapping local port `1523` to the Oracle listener.
- The Azure public IP must never be hardcoded.
- Private SSH keys must never be committed.

## Technology Stack

- Next.js App Router and React
- TypeScript in strict mode
- Tailwind CSS
- shadcn/ui-style primitives backed by Radix UI
- Lucide React icons
- Framer Motion
- React Hook Form and Zod
- Express and Node.js for the backend
- Oracle Database 12c 12.2.0.1
- npm

## Frontend Setup

1. Install Node.js with npm.
2. Copy `.env.example` to `.env.local`.
3. Install dependencies with `npm install`.
4. Start the frontend with `npm run dev`.
5. Open `http://localhost:3000`.

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
```

Root `.env` and `.env.local` are frontend-local configuration files and are ignored by Git. The frontend template currently contains:

```dotenv
NEXT_PUBLIC_ENABLE_DEMO_AUTH=true
```

## Backend Setup

Copy `backend/.env.example` to `backend/.env`.

`backend/.env` contains backend secrets and is ignored by Git. Keep Oracle credentials in the backend environment only, and do not commit passwords, Azure IP addresses, private keys, subscription details, or other credentials.

The backend should continue connecting as `LTMS_APP`, not `SYS`, `SYSTEM`, `LTMS_OWNER`, or any `DEV_*` account.

## Database Source Control

Database source control will use ordered migrations in `database/migrations/`, later using names such as `V001__description.sql`.

The file `database/reference/PitchSync_DDL_Oracle.txt` is retained only as reference material. It is not an applied migration, and no actual PitchSync schema has been created in Git yet.

## Development Workflow

```text
git pull
-> start Azure VM
-> establish SSH tunnel
-> work/test
-> add SQL migrations or application changes
-> commit
-> push
-> close tunnel
-> deallocate Azure VM
```

Use SQL Developer separately for schema work through your own `DEV_*` proxy account when needed.

## Temporary Demonstration Authentication

The sign-in experience performs client-side shape validation only. It does not verify credentials, and the entered password is never stored. Email, password, and role are validated together on `/sign-in`, then the user is sent directly to the selected role's dashboard.

The temporary session uses `sessionStorage` under `pitchsync-demo-session` and contains only:

- A temporary signed-in boolean
- The selected role

It contains no identity, password, token, or business record. Refreshing the browser tab preserves the selected role for that browser session; signing out removes it. Only one role is active in a session, and selecting another role requires signing out and signing in again.

Available roles are:

- Super Administrator
- Cricket Board Administrator
- Team Performance Manager
- Match Official
- Integrity & Compliance Officer
- Player

Role definitions, visual accents, dashboards, navigation, and route access are maintained separately in `src/config`.

## Implemented Screens

1. Sign-in - `/sign-in`
2. Super Administrator dashboard - `/super-admin/dashboard`
3. Cricket Board Administrator dashboard - `/board-admin/dashboard`
4. Team Performance Manager dashboard - `/performance/dashboard`
5. Match Official dashboard - `/match-official/dashboard`
6. Integrity & Compliance Officer dashboard - `/integrity/dashboard`
7. Player dashboard - `/player/dashboard`
8. Player registry - `/players`
9. Player profile - `/players/[playerId]`
10. Register player - `/players/new`
11. Team management - `/teams`
12. Tournament management - `/tournaments`
13. Match details - `/matches/[matchId]`
14. Complaint registry - `/integrity/complaints`
15. Integrity case details - `/integrity/cases/[caseId]`

The supported structural paths are `/players/preview`, `/matches/preview`, and `/integrity/cases/preview`; they render blank detail screens rather than invented records. The former `/select-role` route has been removed because role selection now occurs during sign-in.

## No-Dummy-Data Policy

PitchSync ships without fabricated players, teams, matches, tournaments, complaints, cases, metrics, identities, dates, logs, or integration claims. Data-driven views begin in loading, empty, error, backend-unavailable, or ready-with-empty-collection states. Unknown values display a dash, and all metric cards state that they await backend integration.

The registration form keeps user-entered values only in active React component memory. Final submission validates the form and explains that backend integration is required; it does not create or persist a player.

## Data-State Previews

For development checks, add one of these query parameters to data-driven routes:

- `?state=loading`
- `?state=empty`
- `?state=error`
- `?state=backend-unavailable`

These options alter presentation only and never generate records.

## Backend-Ready Boundaries

Repository contracts live in `src/data/contracts`. The current adapters in `src/data/adapters/unavailable` return no records and report that the backend is unavailable. A future database-backed service can implement these contracts without placing request logic inside visual components or redesigning the screens.

When real session infrastructure is available, replace `DemoAuthProvider`, replace `DemoRouteGuard`, connect route access to the backend session, and remove the `sessionStorage` adapter in `src/features/demo-auth`.

## Deferred Modules

Deferred modules include user-management details, role and permission editors, system logs and audit trail, database and external-service configuration, persons of interest, rulebook and evidence management, communications and documents, detailed career statistics, injury and training management, selection workflows, fixture editing, results entry, match-summary submission, notifications, reports and exports, finance, contracts, global search, file uploads, real authentication and authorization, database integration, and a mobile application layout.

The planned demonstration scope is 22 screens. The current frontend completion estimate is approximately 68%. See `PROJECT_SCOPE.md` for the scope snapshot and `src/config/module-status.ts` for route-level status.

Deferred sidebar entries remain visible but have no link, route, or click behavior. Development status, persistence details, and completion disclosures are intentionally kept out of the product interface and documented only here and in `PROJECT_SCOPE.md`.

## License

This repository is maintained for academic and educational purposes.
