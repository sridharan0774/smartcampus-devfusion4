import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { CreateAnnouncementSchema } from '@smartcampus/shared';
import { Role } from '@prisma/client';

export const createAnnouncement = async (req: AuthenticatedRequest, res: Response) => {
  const data = CreateAnnouncementSchema.parse(req.body);
  const authorId = req.user!.userId;

  const announcement = await prisma.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      priority: data.priority,
      targetRole: data.targetRole ? (data.targetRole as Role) : null,
      departmentId: data.departmentId || null,
      authorId,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
    },
    include: {
      author: { select: { id: true, name: true, role: true } },
      department: true,
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Announcement published successfully.',
    data: announcement,
  });
};

export const listAnnouncements = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { targetRole: null },
        { targetRole: role as Role },
      ],
      AND: [
        {
          OR: [
            { expiryDate: null },
            { expiryDate: { gte: new Date() } },
          ],
        },
      ],
    },
    include: {
      author: { select: { id: true, name: true, role: true } },
      department: true,
    },
    orderBy: { publishDate: 'desc' },
  });

  return res.status(200).json({
    success: true,
    data: announcements,
  });
};
