import { Response, NextFunction } from 'express';
import CollaborationOpportunity from '../models/CollaborationOpportunity';
import { AuthRequest } from '../types';

export const createCollaboration = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postedById = req.user!.id;
    const { type, title, description, domainId } = req.body;

    const collab = await CollaborationOpportunity.create({
      postedById,
      type,
      title,
      description,
      domainId,
    });

    res.status(201).json({
      success: true,
      data: collab,
    });
  } catch (error) {
    next(error);
  }
};

export const getCollaborations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { domainId } = req.query;
    const filter: any = {};
    if (domainId) filter.domainId = domainId;

    const collabs = await CollaborationOpportunity.find(filter)
      .populate('postedById', 'profile.firstName profile.lastName role')
      .populate('domainId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: collabs,
    });
  } catch (error) {
    next(error);
  }
};

export const expressInterest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const academicianId = req.user!.id;
    const { id: collabId } = req.params;

    const collab = await CollaborationOpportunity.findByIdAndUpdate(
      collabId,
      {
        $addToSet: { interestedAcademicianIds: academicianId },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: collab,
    });
  } catch (error) {
    next(error);
  }
};
