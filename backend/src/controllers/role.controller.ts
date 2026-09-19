import { Response, NextFunction } from 'express';
import Role from '../models/Role';
import { AuthRequest } from '../types';
import User from '../models/User';

export const getCareerRoles = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id).select('domainId role');
    const domainId = user?.role === 'student'
      ? user.domainId?.toString()
      : (req.query.domainId as string);
    if (!domainId) {
      res.status(400).json({ success: false, data: null, error: { code: 'DOMAIN_REQUIRED', message: 'Select a domain first' } });
      return;
    }
    const filter: Record<string, unknown> = { domainId, isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
    const roles = await Role.find(filter).populate('requirements.skillId', 'name description').sort({ category: 1, name: 1 });
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

export const getCareerRole = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id).select('domainId role');
    const domainId = user?.role === 'student' ? user.domainId : (req.query.domainId as string);
    const role = await Role.findOne({ _id: req.params.id, domainId, isActive: true })
      .populate('requirements.skillId', 'name description');
    if (!role) {
      res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Career role not found in your domain' } });
      return;
    }
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
};
