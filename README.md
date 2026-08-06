# PitchSync

PitchSync is an internal cricket administration and integrity management interface created for an academic DBMS project. This repository represents a frontend-only milestone: it provides 15 polished product screens and one temporary role-selection screen, while backend completion remains at 0%.

The application contains no backend, API routes, database client, authentication server, external integrations, or stored business records.

## Technology stack

- Next.js App Router and React
- TypeScript in strict mode
- Tailwind CSS
- shadcn/ui-style primitives backed by Radix UI
- Lucide React icons
- Framer Motion
- React Hook Form and Zod
- npm

## Setup

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

## Environment variables

```dotenv
NEXT_PUBLIC_ENABLE_DEMO_AUTH=true
NEXT_PUBLIC_SHOW_STATE_SWITCHER=false
```

Set `NEXT_PUBLIC_SHOW_STATE_SWITCHER=true` to expose a development-only visual-state selector in the portal top bar.

## Temporary demonstration authentication

The sign-in experience performs client-side shape validation only. It does not verify credentials, and the entered password is never stored. After validation, a role is selected on `/select-role`.

The temporary session uses `sessionStorage` under `pitchsync-demo-session` and contains only:

- A temporary signed-in boolean
- The selected role

It contains no identity, password, token, or business record. Refreshing the browser tab preserves the selected role for that browser session; signing out removes it.

Available roles are:

- Super Administrator
- Cricket Board Administrator
- Team Performance Manager
- Match Official
- Integrity & Compliance Officer
- Player

Role definitions, visual accents, dashboards, navigation, and route access are maintained separately in `src/config`.

## Implemented screens

1. Sign-in — `/sign-in`
2. Super Administrator dashboard — `/super-admin/dashboard`
3. Cricket Board Administrator dashboard — `/board-admin/dashboard`
4. Team Performance Manager dashboard — `/performance/dashboard`
5. Match Official dashboard — `/match-official/dashboard`
6. Integrity & Compliance Officer dashboard — `/integrity/dashboard`
7. Player dashboard — `/player/dashboard`
8. Player registry — `/players`
9. Player profile — `/players/[playerId]`
10. Register player — `/players/new`
11. Team management — `/teams`
12. Tournament management — `/tournaments`
13. Match details — `/matches/[matchId]`
14. Complaint registry — `/integrity/complaints`
15. Integrity case details — `/integrity/cases/[caseId]`

`/select-role` is temporary scaffolding and is not counted as a product screen. The supported preview paths are `/players/preview`, `/matches/preview`, and `/integrity/cases/preview`; they render blank structural detail screens rather than invented records.

## No-dummy-data policy

PitchSync ships without fabricated players, teams, matches, tournaments, complaints, cases, metrics, identities, dates, logs, or integration claims. Data-driven views begin in loading, empty, error, backend-unavailable, or ready-with-empty-collection states. Unknown values display an em dash, and all metric cards state that they await backend integration.

The registration form keeps user-entered values only in active React component memory. Final submission validates the form and explains that backend integration is required; it does not create or persist a player.

## Data-state previews

With the state switcher enabled, use the top-bar control or add one of these query parameters to data-driven routes:

- `?state=loading`
- `?state=empty`
- `?state=error`
- `?state=backend-unavailable`

These options alter presentation only and never generate records.

## Backend-ready boundaries

Repository contracts live in `src/data/contracts`. The current adapters in `src/data/adapters/unavailable` return no records and report that the backend is unavailable. A future database-backed service can implement these contracts without placing request logic inside visual components or redesigning the screens.

## Removing demonstration authentication

When real session infrastructure is available:

1. Replace `DemoAuthProvider`.
2. Replace `DemoRouteGuard`.
3. Connect route access to the backend session.
4. Remove `/select-role`.
5. Remove the `sessionStorage` adapter in `src/features/demo-auth`.

Product screens and role navigation do not need to be rewritten for this change.

## Deferred modules

Deferred modules include user-management details, role and permission editors, system logs and audit trail, database and external-service configuration, persons of interest, rulebook and evidence management, communications and documents, detailed career statistics, injury and training management, selection workflows, fixture editing, results entry, match-summary submission, notifications, reports and exports, finance, contracts, global search, file uploads, real authentication and authorization, database integration, and a mobile application layout.

The planned demonstration scope is 22 screens. The current frontend completion estimate is approximately 68%. See `PROJECT_SCOPE.md` for the scope snapshot and `src/config/module-status.ts` for route-level status.
