# Bun Project (Hono + Drizzle + Socket.IO)

A TypeScript backend powered by the Bun runtime. It uses the Hono web framework for HTTP APIs, Drizzle ORM (with postgres-js) for database access, JSON Web Tokens (JWT) for auth, and Socket.IO for real-time features. Static files are served from ./static/public and HTTPS is enabled via a local certificate/key.

## Tech stack
- Bun (>= 1.2.18)
- TypeScript
- Hono (HTTP framework)
- Drizzle ORM + postgres-js (PostgreSQL)
- Socket.IO (real-time)
- Pino (logging)
- ESLint + Prettier
- Vitest (configured; add tests to use)

## Prerequisites
- Bun installed: https://bun.sh/docs/installation
- PostgreSQL running locally or accessible from your machine
- SSL certificate and key files available on your machine (see HTTPS notes below)

## Getting started
1) Install dependencies
```bash
bun install
```

2) Configure environment variables
Create a .env file in the project root (there is an example below). These are the variables read by the app:
```bash
SERVER_PORT=5000

# JWT
JWT_ACCESS_SECRET=replace-with-strong-secret
JWT_REFRESH_SECRET=replace-with-strong-secret
PASSWORD_SALT=replace-with-random-string
# e.g. 15m, 1h, 7d
JWT_ACCESS_EXPIRE="15m"
JWT_REFRESH_EXPIRE="7d"

# Database (PostgreSQL)
DATABASE_DIALECT=postgresql
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=your_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_PROTOCOL=postgres

# Optional
LOG_LEVEL=info
```
A sample .env is already present in the repo. Adjust it for your environment and keep secrets safe.

3) Prepare local folders and HTTPS files
- File uploads save to a local folder. Default path is defined in src/constants/path.constants.ts as:
  - ZIP_UPLOAD_PATH: D:\\data\\uploads
- HTTPS requires a certificate and key. Default paths in src/constants/path.constants.ts:
  - SSL_CERTIFICATE_PATH: D:/ssl certificates/server-ec.crt
  - SSL_KEY_PATH: D:/ssl certificates/server-ec.key
Create these folders/files or update the paths to match your machine.

4) Create the database
- Create a PostgreSQL database matching DATABASE_NAME in your .env.

5) (Optional but recommended) Run Drizzle migrations
This project uses Drizzle ORM with schema files in src/entities/*.entity.ts and drizzle.config.ts.
You can generate and apply migrations with drizzle-kit:
```bash
# Generate SQL from the schema
bunx drizzle-kit generate

# Apply migrations to the database
bunx drizzle-kit migrate
```
Make sure DATABASE_* values in .env are correct before running migrations.

## Running the app
- Development (auto-reload):
```bash
bun run dev
```
- Run without watch (useful for debugging):
```bash
bun run dev-debug
```

The server prints routes on startup and serves static files from ./static/public at /*.

### Build and run for production
- Build (Bun runtime target):
```bash
bun run build
```
- Start the built server:
```bash
bun run start
```
- Alternative build targeting Node.js:
```bash
bun run build:node
```
This produces output in `dist/`.

## API overview
All routes are mounted under the base path `/api`.
Use `Authorization: Bearer <token>` for endpoints protected by auth.

- System
  - GET `/api/sys-info` — health/system info

- Auth
  - POST `/api/auth/register` — register a user
  - POST `/api/auth/login` — login (returns access/refresh tokens)
  - POST `/api/auth/refresh` — refresh access token

- Users (require JWT)
  - GET `/api/users` — list users
  - GET `/api/users/:id` — get a user by `id`
  - PUT `/api/user` — update the authenticated user
  - POST `/api/users` — bulk/add users

- Projects (require JWT)
  - `GET /api/projects` — list projects; supports pagination with `?page=<number>&size=<number>`
  - `GET /api/projects/:id` — get a project by `id`
  - `POST /api/projects` — create a project (`userId` is taken from the authenticated user)
  - `DELETE /api/projects/:id` — delete a project

- Files (require JWT)
  - POST `/api/file` — upload binary content for a project
    - Query: `projectId`
    - Body: raw binary (the service saves it as a `.zip` file to `ZIP_UPLOAD_PATH`)

- Game (some routes require JWT)
  - `POST /api/game/match/guest` — start a guest match
  - `POST /api/game/match` — start a match (JWT)
  - `DELETE /api/game/match/:connectionId` — cancel a match (JWT)

- Shell (require JWT)
  - `POST /api/shell` — start a shell session

A more detailed contract (DTOs, validation constraints) can be derived from the code in `src/controllers` and `src/validations`.

## Realtime (Socket.IO)
- Socket.IO is mounted on the same HTTPS server, default path /socket.io.
- On connection, the server expects a CLIENT_HELLO with an authorization field (JWT). Example client:
```js
const socket = io("https://localhost:5000", { path: "/socket.io" });
socket.emit("client-hello", { authorization: "<accessToken>" });
socket.on("server-hello", (msg) => console.log(msg));
```
- A connectionId is issued and used internally for features like game/shell.

## HTTPS notes
The server uses node:https with a certificate and private key read from src/services/utils.service.ts via src/constants/path.constants.ts. Ensure those files exist at the paths you configured. If you need to run without HTTPS, you can modify server.ts to use plain HTTP (remove createServer and serverOptions and call serve({ fetch: app.fetch })) — but HTTPS is recommended in development to match production behaviors.

## Formatting, linting, and tests
- Format:
```bash
bun run format:fix
```
- Lint:
```bash
bun run lint
```
- Tests (add tests under e.g. src/**/*.spec.ts):
```bash
bun run test
```

## Troubleshooting
- EADDRINUSE on startup: another process is using SERVER_PORT. Change the port or stop the other process.
- SSL errors (ENOENT): your certificate/key paths are incorrect or files do not exist. Adjust src/constants/path.constants.ts.
- Database connection errors: verify .env DATABASE_* values and that PostgreSQL is running and reachable.
- 401 Unauthorized on protected APIs: ensure you send Authorization: Bearer <accessToken> and that the token is not expired.

---

This project was bootstrapped with `bun init` (bun v1.2.18) and extended with Hono, Drizzle ORM, and Socket.IO.
