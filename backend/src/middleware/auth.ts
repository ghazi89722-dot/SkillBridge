import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest } from '../types';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided. Authentication required.',
        },
      });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
        role: string;
        email: string;
        name: string;
      };

      (req as AuthRequest).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token.',
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'Authentication error.',
      },
    });
  }
};
