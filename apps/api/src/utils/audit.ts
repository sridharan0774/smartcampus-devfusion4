import { prisma } from '../config/prisma';

export const logAuditAction = async (
  userId: string,
  action: string,
  resource: string,
  details?: string,
  ipAddress?: string
) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        resource,
        details,
        ipAddress: ipAddress || '127.0.0.1',
      },
    });
  } catch (error) {
    console.error('❌ Failed to log audit action:', error);
  }
};
