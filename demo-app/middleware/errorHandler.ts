import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * globalErrorHandler — Express error middleware.
 * Must be registered LAST in the middleware chain (after all routes).
 *
 * Distinguishes operational errors (expected, safe to surface)
 * from programmer errors (unexpected, should not expose details).
 */
export function globalErrorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational ?? false;

  if (isOperational) {
    // Safe to return error details to client
    res.status(statusCode).json({
      error: err.message,
    });
  } else {
    // Log internally, return generic message
    console.error('[unhandled error]', err);
    res.status(500).json({
      error: 'An internal server error occurred.',
    });
  }
}
