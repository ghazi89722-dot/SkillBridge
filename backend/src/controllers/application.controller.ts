import { Response, NextFunction } from 'express';
import Application from '../models/Application';
import { AuthRequest } from '../types';
import { calculateMatch } from '../services/matching.service';
import { ApplicationStatus } from '../config/constants';

export const applyForOpportunity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.id;
    const { opportunityId } = req.body;

    // Check if already applied
    const existing = await Application.findOne({ studentId, opportunityId });
    if (existing) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'ALREADY_APPLIED', message: 'You have already applied for this opportunity' },
      });
      return;
    }

    // Capture match result snapshot at time of application
    const matchSnapshot = await calculateMatch(studentId, opportunityId);

    const application = await Application.create({
      studentId,
      opportunityId,
      status: ApplicationStatus.APPLIED,
      matchResultSnapshot: matchSnapshot,
      appliedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.id;

    const applications = await Application.find({ studentId })
      .populate({
        path: 'opportunityId',
        populate: { path: 'industryId', select: 'name email profile' },
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationsByOpportunity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { opportunityId } = req.params;

    const applications = await Application.find({ opportunityId })
      .populate('studentId', 'name email profile')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!application) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Application not found' },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
