import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';

export const globalSearch = async (req: AuthenticatedRequest, res: Response) => {
  const q = req.query.q as string;

  if (!q || q.trim().length < 2) {
    return res.status(200).json({
      success: true,
      data: {
        students: [],
        faculty: [],
        events: [],
        assignments: [],
        placements: [],
        announcements: [],
      },
    });
  }

  const query = q.trim();

  const [students, faculty, events, assignments, placements, announcements] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: 'STUDENT',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { rollNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, email: true, rollNumber: true, avatarUrl: true },
      take: 5,
    }),
    prisma.user.findMany({
      where: {
        role: 'FACULTY',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, email: true, avatarUrl: true },
      take: 5,
    }),
    prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { venue: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, title: true, venue: true, startDate: true },
      take: 5,
    }),
    prisma.assignment.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, title: true, deadline: true },
      take: 5,
    }),
    prisma.placement.findMany({
      where: {
        OR: [
          { companyName: { contains: query, mode: 'insensitive' } },
          { jobRole: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, companyName: true, jobRole: true, ctc: true },
      take: 5,
    }),
    prisma.announcement.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, title: true, priority: true, publishDate: true },
      take: 5,
    }),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      students,
      faculty,
      events,
      assignments,
      placements,
      announcements,
    },
  });
};
