import { Router, Request, Response } from 'express';
import { handlePasswordReset } from '../auth/passwordReset';
import { generateResetToken } from '../services/tokenService';
import { sendPasswordResetEmail } from '../services/emailService';

const router = Router();

/**
 * POST /auth/forgot-password
 * Accepts an email address and sends a reset link.
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Generate a time-limited reset token
  const token = await generateResetToken(email);

  // Send the reset email
  await sendPasswordResetEmail(email, token);

  // Always return 200 to avoid email enumeration
  return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
});

/**
 * POST /auth/reset-password
 * Accepts a token + new password and completes the reset.
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and newPassword are required' });
  }

  const result = await handlePasswordReset({ token, newPassword });

  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }

  return res.status(200).json({ message: result.message });
});

export default router;
