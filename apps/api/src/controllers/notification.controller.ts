import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';

export const listNotifications = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return res.status(200).json({
    success: true,
    data: {
      unreadCount,
      notifications,
    },
  });
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });

  return res.status(200).json({
    success: true,
    message: 'Notification marked as read.',
  });
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return res.status(200).json({
    success: true,
    message: 'All notifications marked as read.',
  });
};
