# Database
# #. .
This directory is prepared for Git-based database development, but the actual PitchSync schema has not been authored here yet.

## What Goes In Git

Git stores:

- DDL scripts
- migration scripts
- PL/SQL source
- views
- seed scripts
- tests

Git does not store:

- Oracle datafiles
- Docker volumes
- database passwords
- database dumps unless intentionally approved
- SSH keys
- Azure secrets
- `.env` files
- Oracle installation ZIP files

## Migration Convention

Future schema changes should be added as numbered migration files such as:

- `V001__description.sql`
- `V002__description.sql`
- `V003__description.sql`

Migrations must be applied in numeric order. Do not create ad hoc schema files once the team starts using migrations.

## Execution Model

Schema-changing SQL is executed against `LTMS_OWNER`.

Individual developers should authenticate through their own `DEV_*` proxy accounts rather than sharing the `LTMS_OWNER` password directly. The Express backend must not use `SYSTEM`, `SYS`, `LTMS_OWNER`, or any `DEV_*` account. Application access belongs to `LTMS_APP`.

Developers may still use SQL Developer separately for schema development through their proxy accounts.

## Current Subdirectories

- `migrations/` for ordered schema change scripts
- `seeds/` for optional seed or reference data scripts
- `views/` for standalone view definitions
- `procedures/` for stored procedures
- `functions/` for stored functions
- `triggers/` for trigger source
- `packages/` for Oracle package specs and bodies
- `tests/` for SQL validation and regression checks
- `reference/` for legacy reference material that is not part of the migration history
