import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { logAuditAction } from '../utils/audit';
import { Role } from '@prisma/client';

export const listUsers = async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '20', 10);
  const search = req.query.search as string;
  const role = req.query.role as string;
  const departmentId = req.query.departmentId as string;

  const where: any = {};

  if (role) {
    where.role = role as Role;
  }

  if (departmentId) {
    where.departmentId = departmentId;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { rollNumber: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        rollNumber: true,
        semester: true,
        department: { select: { id: true, name: true, code: true } },
        createdAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
};

export const updateUserRole = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role, departmentId } = req.body;
  const adminId = req.user!.userId;

  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role provided.',
      code: 'INVALID_ROLE',
    });
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      role,
      departmentId: departmentId || undefined,
    },
  });

  await logAuditAction(
    adminId,
    'ASSIGN_ROLE',
    'User',
    `Assigned role ${role} to user ${user.email} (${user.id})`,
    req.ip
  );

  return res.status(200).json({
    success: true,
    message: `Role updated to ${role} for ${user.name}.`,
    data: user,
  });
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const adminId = req.user!.userId;

  if (id === adminId) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own active administrator account.',
      code: 'SELF_DELETE_PROHIBITED',
    });
  }

  const targetUser = await prisma.user.findUnique({ where: { id } });

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
      code: 'NOT_FOUND',
    });
  }

  await prisma.user.delete({ where: { id } });

  await logAuditAction(
    adminId,
    'DELETE_USER',
    'User',
    `Deleted user account ${targetUser.email} (${targetUser.name})`,
    req.ip
  );

  return res.status(200).json({
    success: true,
    message: `User ${targetUser.name} deleted successfully.`,
  });
};

export const listAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  const logs = await prisma.activityLog.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return res.status(200).json({
    success: true,
    data: logs,
  });
};

export const getSettings = async (_req: AuthenticatedRequest, res: Response) => {
  const settings = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  settings.forEach(s => {
    map[s.key] = s.value;
  });
  return res.status(200).json({ success: true, data: map });
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response) => {
  const settingsMap = req.body;
  const adminId = req.user!.userId;

  for (const [key, value] of Object.entries(settingsMap)) {
    if (typeof value === 'string') {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
  }

  await logAuditAction(
    adminId,
    'UPDATE_SETTINGS',
    'Setting',
    `Updated platform system settings configuration`,
    req.ip
  );

  return res.status(200).json({
    success: true,
    message: 'System settings updated successfully.',
  });
};
