# Agent Scratchpad — Developer Productivity Agent

_This file is the agent's external memory. Findings are appended here after each question so they survive context resets._

---

<!-- Agent appends entries below this line -->

## Password Reset Flow — 2026-06-25

- **Two-phase flow**: Phase 1 = request link (`POST /auth/forgot-password`), Phase 2 = complete reset (`POST /auth/reset-password`)
- **Entry point**: `routes/auth.ts` handles both routes
- **Token**: JWT signed with `RESET_TOKEN_SECRET`, 1h expiry, carries `{ userId, email, type: 'password-reset' }`
- **Security**: Route returns 200 even for unknown emails (prevents enumeration); token invalidated after use via in-memory Set denylist
- **Key files**: `routes/auth.ts` → `auth/passwordReset.ts` → `services/tokenService.ts` + `services/emailService.ts`
- **Password hashing**: bcrypt at 10 salt rounds in `passwordReset.ts`

## Orders Data Model — 2026-06-25

- **Model file**: `models/order.ts` — defines `Order`, `OrderItem`, `OrderStatus`
- **Fields**: `id`, `userId`, `items[]`, `status`, `totalAmount` (auto-calc), `createdAt`, `updatedAt`
- **State machine**: pending → confirmed/cancelled → shipped → delivered (terminal); cancelled is terminal
- **`canTransition(from, to)`**: guards PATCH route — illegal transitions return 400
- **`calculateTotal(items)`**: sums `quantity × unitPrice`; no discounts (checkout layer handles those)
- **Routes**: `routes/orders.ts` — GET (list own), POST (create), PATCH /:id/status (transition); all require JWT auth

## Auth Middleware — 2026-06-25 (via deep-explorer subagent)

- **Purpose**: Express middleware enforcing JWT auth + role-based access control
- **Exports**: `requireAuth` (JWT verify → attach `req.user`), `requireAdmin` (composes requireAuth + role check), `AuthenticatedRequest` interface
- **Flow**: Authorization header check → Bearer prefix validation → `jwt.verify` → attach decoded payload → `next()` or 401/403
- **Security flag**: `JWT_SECRET` falls back to hardcoded `'dev-secret-key'` — must be set in production via env var
- **TS note**: Route handlers use `req.user!.id` (non-null assertion) — safe only because `requireAuth` always guards them; removing the middleware would cause runtime throws
- **No revocation**: Stolen tokens remain valid until JWT expiry — no denylist for session tokens (contrast: reset tokens DO have a denylist in tokenService.ts)

## /explore auth middleware — 2026-06-25

- **Command used**: `/explore auth middleware` (via .claude/commands/explore.md workflow)
- **Grep hits**: `auth/middleware.ts`, `routes/orders.ts`, `middleware/errorHandler.ts`
- **Glob hits**: `auth/middleware.ts`
- **Key exports**: `requireAuth` (JWT), `requireAdmin` (JWT + role), `AuthenticatedRequest` (typed req interface)
- **Consumer**: `routes/orders.ts` applies `requireAuth` on all 3 routes (GET, POST, PATCH)
- **Risk**: Hardcoded fallback `JWT_SECRET = 'dev-secret-key'` — production must set env var
