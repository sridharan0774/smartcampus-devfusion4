import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('❌ Express Error Handler:', err);

  if (err instanceof ZodError || err?.name === 'ZodError' || (err && (Array.isArray(err.issues) || Array.isArray(err.errors)))) {
    const details = err.issues || err.errors || [];
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: details,
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    code: err.code || 'INTERNAL_ERROR',
  });
};
