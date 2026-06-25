# Demo App — Scoped CLAUDE.md

This CLAUDE.md applies only when working inside the `demo-app/` directory. It adds app-specific context on top of the root CLAUDE.md rules.

## App Overview

This is a mock Node.js/Express/TypeScript REST API with:
- JWT-based authentication
- Password reset via email tokens
- Order management with status state machine
- Role-based middleware

## Key Entry Points

| Route file              | Purpose                          |
|-------------------------|----------------------------------|
| routes/auth.ts          | Login, register, password reset  |
| routes/orders.ts        | CRUD operations for orders       |

## Data Models

| Model file              | Key fields                                      |
|-------------------------|------------------------------------------------|
| models/user.ts          | id, email, passwordHash, role, createdAt       |
| models/order.ts         | id, userId, items[], status, totalAmount       |

## Service Layer

| Service file               | Responsibility                        |
|----------------------------|---------------------------------------|
| services/tokenService.ts   | Generate and verify JWT reset tokens  |
| services/emailService.ts   | Send password reset emails            |

## Auth Flow Summary

```
POST /auth/reset-password
  → routes/auth.ts
  → auth/passwordReset.ts (validateToken, hashNewPassword)
  → services/tokenService.ts (verifyResetToken)
  → services/emailService.ts (sendResetConfirmation)
```

## Scoped Rules

- When exploring auth topics: always start with routes/auth.ts
- When exploring data models: always start with models/
- TypeScript strict mode is ON — note type assertions carefully
- Passwords are hashed with bcrypt (10 rounds)
