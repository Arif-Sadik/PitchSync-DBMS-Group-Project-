# PitchSync Frontend Scope

PitchSync is currently a frontend-only academic DBMS project milestone. It demonstrates a substantial portion of the planned product interface without claiming completion of the full system.

## Completion snapshot

| Measure | Status |
| --- | --- |
| Product screens implemented | 15 |
| Planned demonstration scope | 22 screens |
| Approximate current frontend completion | 68% |
| Temporary scaffolding screens | 1 |
| Backend completion | 0% |
| Database integration | Deferred |
| Real authentication | Deferred |

The 15 product screens comprise one sign-in screen, six role dashboards, three player-management screens, team management, tournament management, match details, the complaint registry, and integrity case details. Role selection is temporary scaffolding and is not counted as a product screen.

## Intentionally deferred

Deferred work includes real authentication and authorization, database integration, user and permission editors, system and audit logs, external service configuration, reports, notifications, evidence and document management, fitness and injury workflows, training and selection workflows, fixture authoring, results entry, file uploads, exports, and mobile layouts.

Route and module statuses are maintained in `src/config/module-status.ts`; this document reflects that configuration.
