import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { CreateClubSchema } from '@smartcampus/shared';

export const createClub = async (req: AuthenticatedRequest, res: Response) => {
  const data = CreateClubSchema.parse(req.body);

  const club = await prisma.club.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      logoUrl: data.logoUrl || null,
      coordinatorId: data.coordinatorId,
    },
    include: {
      coordinator: { select: { id: true, name: true, email: true } },
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Student club created successfully.',
    data: club,
  });
};

export const listClubs = async (req: AuthenticatedRequest, res: Response) => {
  const clubs = await prisma.club.findMany({
    include: {
      coordinator: { select: { id: true, name: true, email: true } },
      _count: { select: { memberships: { where: { status: 'APPROVED' } } } },
    },
    orderBy: { name: 'asc' },
  });

  if (req.user?.role === 'STUDENT') {
    const studentMemberships = await prisma.clubMembership.findMany({
      where: { studentId: req.user.userId },
    });

    const memMap = new Map(studentMemberships.map(m => [m.clubId, m]));

    const enriched = clubs.map(c => {
      const mem = memMap.get(c.id);
      return {
        ...c,
        memberCount: c._count.memberships,
        membershipStatus: mem ? mem.status : 'NONE',
      };
    });

    return res.status(200).json({ success: true, data: enriched });
  }

  return res.status(200).json({
    success: true,
    data: clubs.map(c => ({ ...c, memberCount: c._count.memberships })),
  });
};

export const requestMembership = async (req: AuthenticatedRequest, res: Response) => {
  const { clubId } = req.params;
  const studentId = req.user!.userId;

  const club = await prisma.club.findUnique({
    where: { id: clubId },
  });

  if (!club) {
    return res.status(404).json({
      success: false,
      message: 'Club not found.',
      code: 'NOT_FOUND',
    });
  }

  const existing = await prisma.clubMembership.findUnique({
    where: {
      clubId_studentId: { clubId, studentId },
    },
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'You have already requested membership for this club.',
      code: 'DUPLICATE_MEMBERSHIP',
    });
  }

  const membership = await prisma.clubMembership.create({
    data: {
      clubId,
      studentId,
      status: 'APPROVED', // auto-approve for streamlined demo
    },
  });

  return res.status(201).json({
    success: true,
    message: `Welcome to ${club.name}! Your membership is active.`,
    data: membership,
  });
};
