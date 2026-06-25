import jwt from 'jsonwebtoken';

const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || 'reset-secret-key';
const RESET_TOKEN_EXPIRY = '1h';

// Mock store for invalidated tokens
const invalidatedTokens = new Set<string>();

export interface ResetTokenPayload {
  userId: string;
  email: string;
  type: 'password-reset';
}

/**
 * generateResetToken — creates a signed JWT for password reset.
 * Expires in 1 hour. Contains userId, email, and type claim.
 */
export async function generateResetToken(email: string): Promise<string> {
  // In production, look up userId from DB
  const mockUserId = `user_${email.replace('@', '_').replace('.', '_')}`;

  const token = jwt.sign(
    { userId: mockUserId, email, type: 'password-reset' } as ResetTokenPayload,
    RESET_TOKEN_SECRET,
    { expiresIn: RESET_TOKEN_EXPIRY }
  );

  return token;
}

/**
 * verifyResetToken — validates a reset token and returns its payload.
 * Returns null if the token is invalid, expired, or has been invalidated.
 */
export async function verifyResetToken(token: string): Promise<ResetTokenPayload | null> {
  if (invalidatedTokens.has(token)) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, RESET_TOKEN_SECRET) as ResetTokenPayload;
    if (decoded.type !== 'password-reset') return null;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * invalidateToken — adds a token to the denylist.
 * Called after successful password reset to prevent token reuse.
 */
export async function invalidateToken(token: string): Promise<void> {
  invalidatedTokens.add(token);
}
