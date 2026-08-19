import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { CreatePlacementSchema } from '@smartcampus/shared';
import { ApplicationStatus } from '@prisma/client';

export const createPlacement = async (req: AuthenticatedRequest, res: Response) => {
  const data = CreatePlacementSchema.parse(req.body);

  const placement = await prisma.placement.create({
    data: {
      companyName: data.companyName,
      companyLogo: data.companyLogo || null,
      jobRole: data.jobRole,
      description: data.description,
      eligibility: data.eligibility,
      ctc: data.ctc,
      deadline: new Date(data.deadline),
      status: 'OPEN',
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Placement drive posted successfully.',
    data: placement,
  });
};

export const listPlacements = async (req: AuthenticatedRequest, res: Response) => {
  const placements = await prisma.placement.findMany({
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (req.user?.role === 'STUDENT') {
    const myApplications = await prisma.application.findMany({
      where: { studentId: req.user.userId },
    });

    const appMap = new Map(myApplications.map(a => [a.placementId, a]));

    const enriched = placements.map(p => {
      const app = appMap.get(p.id);
      return {
        ...p,
        hasApplied: !!app,
        applicationStatus: app ? app.status : null,
      };
    });

    return res.status(200).json({ success: true, data: enriched });
  }

  return res.status(200).json({ success: true, data: placements });
};

export const applyForPlacement = async (req: AuthenticatedRequest, res: Response) => {
  const { placementId } = req.params;
  const studentId = req.user!.userId;

  const placement = await prisma.placement.findUnique({
    where: { id: placementId },
  });

  if (!placement) {
    return res.status(404).json({
      success: false,
      message: 'Placement drive not found.',
      code: 'NOT_FOUND',
    });
  }

  if (placement.status !== 'OPEN' || new Date() > placement.deadline) {
    return res.status(400).json({
      success: false,
      message: 'This placement drive is closed for applications.',
      code: 'PLACEMENT_CLOSED',
    });
  }

  const existingApp = await prisma.application.findUnique({
    where: {
      placementId_studentId: { placementId, studentId },
    },
  });

  if (existingApp) {
    return res.status(400).json({
      success: false,
      message: 'You have already submitted an application for this placement drive.',
      code: 'DUPLICATE_APPLICATION',
    });
  }

  let resumeUrl = req.body.resumeUrl;
  if (req.file) {
    resumeUrl = `/uploads/${req.file.filename}`;
  }

  if (!resumeUrl) {
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    resumeUrl = student?.resumeUrl;
  }

  if (!resumeUrl) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a resume PDF to submit your application.',
      code: 'RESUME_REQUIRED',
    });
  }

  const application = await prisma.application.create({
    data: {
      placementId,
      studentId,
      resumeUrl,
      status: ApplicationStatus.APPLIED,
    },
  });

  return res.status(201).json({
    success: true,
    message: `Successfully applied for ${placement.jobRole} at ${placement.companyName}!`,
    data: application,
  });
};

export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!Object.values(ApplicationStatus).includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid application status value.',
      code: 'INVALID_STATUS',
    });
  }

  const application = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
    include: { placement: true },
  });

  // Send notification to student
  await prisma.notification.create({
    data: {
      userId: application.studentId,
      type: 'APPLICATION_STATUS',
      title: 'Placement Application Status Updated',
      message: `Your application for ${application.placement.companyName} (${application.placement.jobRole}) status is now: ${status}`,
      link: '/placements',
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Application status updated successfully.',
    data: application,
  });
};
