# Backend

This backend is the only application layer that should talk to Oracle for PitchSync.

## Architecture

```text
Frontend
-> Express/Node backend
-> LTMS_APP
-> Oracle ORCLPDB1
```

The frontend must never connect directly to Oracle.

## Oracle Connectivity

Developers connect through an SSH tunnel to the shared Azure-hosted Oracle instance:

```text
Developer PC
-> localhost:1523
-> SSH tunnel
-> Azure VM
-> Oracle listener 1521
-> ORCLPDB1
```

The backend reads all database settings from environment variables. Do not hardcode the Azure public IP, Oracle passwords, or SSH key paths in source code.

## Environment Variables

Copy `backend/.env.example` to a local `.env` file and fill in only your local development values.

Required variables:

- `DB_USER=LTMS_APP`
- `DB_PASSWORD=`
- `DB_HOST=127.0.0.1`
- `DB_PORT=1523`
- `DB_SERVICE=ORCLPDB1`

The backend constructs the Oracle connect string in this format:

```text
127.0.0.1:1523/ORCLPDB1
```

That value is assembled from environment variables inside `src/config/database.js`.

## Layout

- `src/config/database.js` stores Oracle connection setup
- `src/controllers/` is reserved for request handlers
- `src/services/` is reserved for business logic
- `src/routes/` is reserved for API routes
- `src/middleware/` is reserved for Express middleware
- `scripts/test-connection.js` verifies the SSH-tunneled Oracle connection
