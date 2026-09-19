import { Response, NextFunction } from 'express';
import { UserRole } from '../config/constants';
import { AuthRequest } from '../types';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: `Access forbidden. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
        },
      });
      return;
    }

    next();
  };
};
