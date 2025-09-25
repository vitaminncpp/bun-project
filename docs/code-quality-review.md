# Code Quality Review — bun-project

Date: 2025-09-24 18:13 (local)
Reviewer: Automated analysis (Junie by JetBrains)
Scope: Server application written in TypeScript using Hono, Socket.IO, Drizzle ORM, and Bun runtime.

---

## Executive Summary

Overall, the project demonstrates a solid modular structure with clear separation of concerns (controllers, services, repositories, routers, and middlewares). TypeScript is used broadly, with centralized error handling and conventional DTO-style models for responses. Socket.IO is integrated and the persistence layer uses Drizzle ORM with typed entities.

However, there are several critical security and correctness issues that should be addressed with high priority:

- Exposing sensitive system and environment information via an unauthenticated API endpoint.
- Session/connection security model that trusts a raw connectionId not bound to the authenticated user.
- Token verification mapping all JWT errors to internal server errors instead of proper 401 responses.
- Access/refresh token expiry misconfiguration in refresh flow.

Addressing these will significantly improve the robustness and security posture of the application.

Overall quality rating: Good (7/10)

---

## Strengths and Best Practices

- Clear layering and modularity
  - Controllers, services, repositories, routers, and middlewares are well separated.
  - Constants centralize api endpoints and other values (src/constants/apiEndpoints.ts, etc.).
  - Use of models for SuccessResponse and ErrorResponse standardizes API payloads.
- TypeScript usage
  - Widespread typing across controllers, services, repositories, and models.
  - Use of enums (ErrorCode, GameStatus, Player) improves readability and safety.
- Centralized error handling
  - error.middleware.ts provides consistent error translation to HTTP status codes.
  - Custom Exception type used consistently across repository/service layers.
- Authentication stack
  - JWT-based auth with bcrypt password hashing and environment-based salting.
  - Middleware injects authenticated user into the request context (Constants.AUTH_DATA).
- Database layer
  - Drizzle ORM with typed entities and repositories per aggregate (users, projects, games).
  - Pagination implemented in list queries (users, projects) and projects include a total count.
- Socket.IO integration
  - Dedicated socket services for chat, game, and shell; central index attaches to server.
  - Connection lifecycle handled (activeConnections map, cleanup on disconnect).
- Developer experience
  - showRoutes(app) helpful in development.
  - CORS middleware enabled; project structure is easy to navigate.

---

## Issues, Severity, and Actionable Improvements

Legend:

- 🟢 Excellent – follows best practices, no issues
- 🟡 Good – minor issues
- 🟠 Needs Improvement – noticeable problems
- 🔴 Bad – serious design/code smell
- ⚫ Critical – severe bug/security/architectural failure

1. ⚫ Critical — Sensitive system/env data exposed without authentication

- Location: src/controllers/app.controller.ts (sysInfo)
- Details: The /api/sys-info route is publicly accessible (no auth middleware) and returns process.env among other host details (hostname, network interfaces, etc.). This leaks secrets and internal topology.
- Risk: High. Environment variables may include JWT secrets, DB credentials, and more.
- Fix:
  - Protect the route with strong authentication and authorization (admin-only), or remove sensitive fields entirely.
  - At minimum, never return process.env. Provide a safe subset for health checks.
  - Consider moving health and diagnostics to a separate admin service or behind VPN.

2. ⚫ Critical — Connection/session trust model allows misuse of connectionId

- Location: src/services/game.service.ts (findMatch, cancelRequest), src/services/shell.service.ts (startShell), controllers using connectionId from query/params.
- Details: HTTP endpoints accept a connectionId to act on a socket session. activeConnections only stores { socket, authorized: boolean } and is not bound to a user. Services check presence in the map but not that it belongs to the authenticated user or is authorized.
- Risk: High. Any authenticated user who learns another user’s connectionId could perform actions on their session (e.g., start a shell, initiate matches). Even unauthorized sockets may be accepted if present.
- Fix:
  - Store userId with the socket on CLIENT_HELLO after successful JWT check: activeConnections.set(id, { socket, authorized: true, userId }).
  - Validate in services that activeConnections.get(connectionId) exists, is authorized, and matches c.get(Constants.AUTH_DATA).id.
  - Consider rotating/short-living connectionIds and not exposing them in query params.

3. 🔴 Bad — JWT errors mapped to 500 (internal server error)

- Location: src/services/token.service.ts (verifyToken)
- Details: Any jwt.verify error is wrapped and thrown as Exception with ErrorCode.INTERNAL_SERVER_ERROR. The auth middleware calls authenticate() and will bubble errors to global error handler → 500.
- Risk: Clients receive 500 instead of 401 for invalid/expired tokens; security semantics are wrong and leak server stability signals.
- Fix:
  - Map jwt.TokenExpiredError and jwt.JsonWebTokenError to ErrorCode.INVALID_TOKEN and let error.middleware.ts translate to 401.
  - Only unexpected exceptions should become INTERNAL_SERVER_ERROR.

4. 🔴 Bad — Access token expiry misconfigured in refresh flow

- Location: src/services/auth.service.ts refreshToken()
- Details: New access token is generated using envService.getRefreshExpire() instead of getAccessExpire().
- Risk: Longer-than-intended access token validity; security exposure.
- Fix: Use getAccessExpire() when generating the new access token.

5. 🔴 Bad — Unimplemented endpoint exposed (guest match)

- Location: src/controllers/game.controller.ts startMatchGuest; router exposes POST /game/match/guest
- Details: Endpoint is registered but not implemented; may return 404 or hang depending on usage.
- Risk: API inconsistency and client confusion.
- Fix: Implement logic or return 501 Not Implemented with clear message until ready.

6. 🟠 Needs Improvement — CORS policy overly permissive

- Location: src/app.ts (app.use("_", cors())) and Socket.IO server CORS origin: "_"
- Details: Wildcard CORS is convenient for development but risky in production.
- Risk: CSRF-like vectors for credentialed endpoints; broader attack surface.
- Fix: Restrict allowed origins based on environment; disable credentials or tighten headers.

7. 🟠 Needs Improvement — Public Socket.IO event handling without auth checks

- Location: src/services/chat.service.ts and others
- Details: Chat and other events accept and emit messages without verifying socket authorization state.
- Risk: Abuse/spam via unauthenticated clients; possible information leakage.
- Fix: In registerSocket handlers, verify that the socket’s associated connection is authorized (and optionally user role) before processing.

8. 🟠 Needs Improvement — Error handler attempts to read request body for all errors

- Location: src/middlewares/error.middleware.ts
- Details: errorHandler does await c.req.json().catch(() => ({})). Reading body here can be problematic (double-consumption) and may log sensitive data.
- Risk: Potential side effects, performance overhead, and leaking of sensitive content into error payloads.
- Fix: Avoid re-reading body. If needed, store sanitized body in context earlier via a body parsing middleware.

9. 🟠 Needs Improvement — Shell feature security and portability

- Location: src/services/shell.service.ts, routers
- Details: Spawning cmd (Windows-only) and streaming over sockets is powerful but risky. Only auth check is via HTTP middleware; not role-restricted; not verifying socket authorized.
- Risk: High-impact if misused; OS-specific.
- Fix:
  - Restrict to admin role/claims.
  - Verify socket is authorized and belongs to requesting user.
  - Add command allow-list or PTY sandboxing; consider feature flags and environment gating.
  - Support cross-platform shells (sh/ powershell) by detecting platform.

10. 🟠 Needs Improvement — Logging and noisy console output

- Location: repositories (console.log in user.repository.findByUsername), showRoutes in all environments.
- Risk: Leaking data in logs; clutter.
- Fix: Remove stray console.log; gate showRoutes and verbose logs behind NODE_ENV !== 'production'.

11. 🟡 Good/Minor — Deletion without existence check

- Location: project.repository.removeOne
- Details: Returns first element from returning() without verifying record existed.
- Risk: Potential undefined access.
- Fix: Check length and throw project not found if zero.

12. 🟡 Good/Minor — Inconsistent ESM import specifiers

- Location: several imports include .ts extensions while most don’t.
- Risk: Build/runtime inconsistencies depending on bundler/config.
- Fix: Standardize import paths per tsconfig/moduleResolution strategy.

13. 🟡 Good/Minor — Cross-platform considerations for runtime

- Location: server, shell, path constants
- Details: Some features assume Windows (cmd, path separators). The runtime is Bun, which supports multiple platforms.
- Risk: Reduced portability.
- Fix: Use cross-platform commands or conditionals based on process.platform.

14. 🟡 Good/Minor — Validation coverage not shown

- Location: common.validations referenced but not visible here.
- Risk: If validation is incomplete, controllers may accept malformed input.
- Fix: Ensure comprehensive zod/valibot/class-validator schemas for body/query/params.

15. 🟡 Good/Minor — Chat, game move, and other features incomplete

- Location: game.service.makeMove not implemented; role.service commented out.
- Risk: Future maintainability.
- Fix: Hide unfinished routes or return 501 until implemented.

---

## Actionable Fixes (Examples)

- Token service verifyToken
  - Map JWT errors properly:
    - If err.name === 'TokenExpiredError' or 'JsonWebTokenError' → throw new Exception(ErrorCode.INVALID_TOKEN, 'Invalid/Expired Token', token)
    - Otherwise → INTERNAL_SERVER_ERROR
- Auth middleware
  - Wrap authenticate() in try/catch and return 401 on Exception(ErrorCode.INVALID_TOKEN).
- Connection binding
  - On socket CLIENT_HELLO success, store userId: activeConnections.set(id, { socket, authorized: true, userId: user.id })
  - In game/shell services, verify activeConnections.get(connectionId)?.userId === c.get(Constants.AUTH_DATA).id and authorized === true.
- Refresh token
  - Use envService.getAccessExpire() for access token TTL in refreshToken().
- Sys info route
  - Add auth + role check; remove env from response, provide safe health summary only.
- CORS
  - Configure allowed origins from ENV; restrict in production.
- Error handler
  - Remove body capture or add opt-in, sanitized logging via a logger with PII redaction.
- Project delete
  - Throw not found when returning() is empty.

---

## Prioritized Remediation Plan

- P0 (Critical — do immediately)
  1. Protect /api/sys-info and remove process.env from response.
  2. Bind socket connectionId to authenticated userId; validate in services; require authorized sockets.
  3. Fix token verification to return INVALID_TOKEN (401) for JWT errors.
  4. Correct refresh token flow to use access expiry.
- P1 (High) 5. Enforce auth checks in socket event handlers (chat/game) and restrict shell to admin role. 6. Tighten CORS policies for HTTP and Socket.IO. 7. Implement or disable guest match endpoint with proper response (501 if not ready).
- P2 (Medium) 8. Improve error handling (avoid reading body), sanitize logs, remove console.log. 9. Add not-found handling in delete operations. 10. Standardize import paths; gate showRoutes for non-production only.
- P3 (Long-term) 11. Add comprehensive validation schemas and unit/integration tests. 12. Cross-platformize shell functionality and consider PTY sandbox. 13. Implement remaining game features (makeMove) with tests.

---

## Overall Quality Rating

- Score: 7/10 (Good)
- Rationale: Solid architecture and patterns, but with several critical security and correctness issues that should be addressed before production deployment.

---

## Appendix A — Observed API Map (from routers and constants)

- Base: /api
- Auth
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/refresh
- Users
  - GET /api/users
  - GET /api/users/:id
  - POST /api/users (bulk add)
- Game
  - POST /api/game/match (requires auth, connectionId query)
  - DELETE /api/game/match/:connectionId (requires auth)
  - POST /api/game/match/guest (validateConnectionId; currently unimplemented)
- Projects
  - POST /api/projects (requires auth)
  - GET /api/projects/:id
  - GET /api/projects (page,size)
  - DELETE /api/projects/:id
- Utils
  - POST /api/file?projectId=... (file upload)
- Shell
  - POST /api/shell?connectionId=... (requires auth)
- System
  - GET /api/sys-info (currently public; should be protected)
- gRPC test
  - GET /api/grpc/test

Socket.IO

- Path: /socket.io; CORS: \*
- Events: CONNECTION, CLIENT_HELLO, SERVER_HELLO, DISCONNECT, REGISTER_EVENT, PRIVATE_CHAT, MATCH_FOUND, OPPONENT_DISCONNECTED, SHELL_IN, SHELL_OUT, GAME_MOVE

---

## Appendix B — Environment and Configuration

- env.service.ts enforces presence of all required env vars; throws if missing.
- SSL key/cert paths read from Paths.SSL_KEY_PATH / Paths.SSL_CERTIFICATE_PATH; consider existence checks and development fallbacks.
- server.ts configures HTTPS server via @hono/node-server and attaches Socket.IO.
