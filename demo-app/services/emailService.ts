/**
 * emailService.ts — mock email sending service.
 * In production, this would integrate with SendGrid / SES / Resend.
 */

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

/**
 * sendPasswordResetEmail — sends a reset link to the user's email.
 * The link contains the raw JWT token as a query parameter.
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  // Mock: log instead of actually sending
  console.log(`[email] Sending password reset to: ${email}`);
  console.log(`[email] Reset URL: ${resetUrl}`);

  // Production: await emailProvider.send({ to: email, template: 'password-reset', data: { resetUrl } })
}

/**
 * sendResetConfirmationEmail — confirms the password was successfully changed.
 * Sent AFTER the reset completes, not when the link is clicked.
 */
export async function sendResetConfirmationEmail(email: string): Promise<void> {
  console.log(`[email] Sending reset confirmation to: ${email}`);

  // Production: await emailProvider.send({ to: email, template: 'reset-confirmation' })
}
