import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { generateToken, comparePassword } from '../services/auth.service';
import { AuthRequest } from '../types';
import Domain from '../models/Domain';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, phone, preferredLanguage, domainId, profile } =
      req.body;

    const rolesRequiringDomain = ['student', 'industry', 'institution'];
    
    if (rolesRequiringDomain.includes(role) && !domainId) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'DOMAIN_REQUIRED', message: 'Select your field before creating this account' },
      });
      return;
    }
    if (domainId && !(await Domain.exists({ _id: domainId }))) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_DOMAIN', message: 'Selected field was not found' },
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'USER_EXISTS',
          message: 'A user with this email already exists',
        },
      });
      return;
    }

    const userPayload: any = {
      name,
      email,
      passwordHash: password, // Will be hashed in pre-save hook
      role,
      phone,
      preferredLanguage,
      profile: profile || {},
      isVerifiedAccount: role === 'student', // Students auto-verified for MVP
    };

    if (rolesRequiringDomain.includes(role) && domainId) {
      userPayload.domainId = domainId;
    }

    const user = await User.create(userPayload);

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          domainId: user.domainId,
          profile: user.profile,
          isVerifiedAccount: user.isVerifiedAccount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email, include passwordHash
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          domainId: user.domainId,
          profile: user.profile,
          isVerifiedAccount: user.isVerifiedAccount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        },
      });
      return;
    }

    const user = await User.findById(req.user.id).select(
      'name email role domainId profile isVerifiedAccount'
    );
    if (!user) {
      res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        domainId: user.domainId,
        profile: user.profile,
        isVerifiedAccount: user.isVerifiedAccount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateDomain = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { domainId } = req.body;
    const domain = await Domain.findById(domainId);

    if (!domain) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_DOMAIN', message: 'Selected domain was not found' },
      });
      return;
    }

    const currentUser = await User.findById(req.user!.id).select('role domainId');
    if (currentUser?.role === 'student' && currentUser.domainId) {
      res.status(403).json({
        success: false,
        data: null,
        error: { code: 'DOMAIN_LOCKED', message: 'A student domain is locked after signup' },
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { domainId: domain._id },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        domainId: user.domainId,
        profile: user.profile,
        isVerifiedAccount: user.isVerifiedAccount,
      },
    });
  } catch (error) {
    next(error);
  }
};
