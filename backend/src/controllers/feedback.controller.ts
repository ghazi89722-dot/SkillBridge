import { Response, NextFunction } from 'express';
import Feedback from '../models/Feedback';
import Application from '../models/Application';
import { AuthRequest } from '../types';
import SkillResult from '../models/SkillResult';

export const createFeedback = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const industryUserId = req.user!.id;
    const { applicationId, ratings, comments } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      res.status(404).json({ success: false, error: 'Application not found' });
      return;
    }

    const feedback = await Feedback.create({
      applicationId,
      givenById: industryUserId,
      ratings,
      comments,
    });

    // Option: If we wanted this feedback to feed into SkillResult, we would do it here.
    // For now, saving the feedback is the primary action.

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedbackForStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId;

    // Find all applications for this student
    const applications = await Application.find({ studentId });
    const appIds = applications.map(a => a._id);

    const feedbacks = await Feedback.find({ applicationId: { $in: appIds } })
      .populate({
        path: 'applicationId',
        populate: { path: 'opportunityId', select: 'title' }
      })
      .populate('givenById', 'profile.organizationName');

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};
