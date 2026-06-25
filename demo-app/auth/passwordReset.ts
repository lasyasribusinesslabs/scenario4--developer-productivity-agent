import bcrypt from 'bcrypt';
import { verifyResetToken, invalidateToken } from '../services/tokenService';
import { sendResetConfirmationEmail } from '../services/emailService';

const SALT_ROUNDS = 10;

export interface PasswordResetPayload {
  token: string;
  newPassword: string;
}

export interface PasswordResetResult {
  success: boolean;
  message: string;
}

/**
 * handlePasswordReset — validates a reset token and updates the user's password.
 *
 * Flow:
 * 1. Verify the reset token is valid and not expired
 * 2. Hash the new password with bcrypt
 * 3. Update the user record in the database (mocked here)
 * 4. Invalidate the token so it cannot be reused
 * 5. Send a confirmation email to the user
 */
export async function handlePasswordReset(
  payload: PasswordResetPayload
): Promise<PasswordResetResult> {
  // Step 1: Verify token
  const tokenPayload = await verifyResetToken(payload.token);
  if (!tokenPayload) {
    return { success: false, message: 'Invalid or expired reset token' };
  }

  // Step 2: Hash the new password
  const passwordHash = await bcrypt.hash(payload.newPassword, SALT_ROUNDS);

  // Step 3: Update password in DB (mocked)
  console.log(`[mock] Updating password for user ${tokenPayload.userId} — hash: ${passwordHash.slice(0, 10)}...`);

  // Step 4: Invalidate token
  await invalidateToken(payload.token);

  // Step 5: Send confirmation email
  await sendResetConfirmationEmail(tokenPayload.email);

  return { success: true, message: 'Password reset successfully' };
}
