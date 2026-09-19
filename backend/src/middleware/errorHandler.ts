import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: message,
      // Only include stack trace in development
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
