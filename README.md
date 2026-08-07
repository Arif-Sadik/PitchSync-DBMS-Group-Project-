# PitchSync

PitchSync is a centralized cricket board management and integrity monitoring system developed as part of the **CSE-302 Database Management System Sessional**.

## Repository Structure

```text
PitchSync/
PitchSync/
|-- backend/
|   |-- scripts/
|   |-- src/
|   |   |-- config/
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
|   |-- seeds/
|   |-- tests/
|   |-- triggers/
|   |-- views/
|   `-- README.md
|-- docs/
|   |-- PitchSync_Project_Proposal.pdf
|   `-- README.md
|-- frontend/
|   |-- src/
|   `-- README.md
|-- .gitignore
`-- README.md
```

## Architecture

- Shared Oracle Database 12c Release 2 is hosted on an Azure Ubuntu VM inside Docker.
- The Oracle pluggable database/service is `ORCLPDB1`.
- Developers connect locally through an SSH tunnel instead of exposing Oracle directly:

```text
Developer PC
-> localhost:1523
-> SSH tunnel
-> Azure VM
-> Oracle listener 1521
-> ORCLPDB1
```

- The frontend talks to the Node/Express backend.
- The backend connects to Oracle using the `LTMS_APP` database user.
- Database source control will follow an ordered migration approach in `database/migrations/`.

## Planned Technology Stack

- **Database:** Oracle Database 12c
- **Framework:** Next.js
- **Backend:** Node.js
- **Frontend:** React
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion

## Supported Cricket Formats

- Test
- ODI / One Day
- T20
- First-Class
- List A
- Domestic T20

## Project Scope

PitchSync is intended for authorized internal cricket board users. It does not include public access, ball-by-ball scoring, complete medical records, medical diagnosis, or automated legal decision-making.

## Team

Developed by **Group A9**  
Department of Computer Science and Engineering  
Military Institute of Science and Technology

## Status

This project is currently in the structure and preparation stage.

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

Use SQL Developer separately for schema work through your own `DEV_*` proxy account when needed. Do not commit passwords, Azure IP addresses, private keys, subscription details, or other credentials.

Copy `backend/.env.example` to `backend/.env`.

## License

This repository is maintained for academic and educational purposes.
