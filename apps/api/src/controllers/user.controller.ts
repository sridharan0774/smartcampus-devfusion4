import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { UpdateProfileSchema } from '@smartcampus/shared';

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.id || req.user?.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      department: true,
      attendanceRecords: {
        include: {
          session: {
            include: { subject: true },
          },
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
      },
      submissions: {
        include: { assignment: true },
        take: 10,
        orderBy: { submittedAt: 'desc' },
      },
      eventRegistrations: {
        include: { event: true },
        take: 10,
      },
      applications: {
        include: { placement: true },
        take: 10,
      },
      clubMemberships: {
        include: { club: true },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User profile not found',
      code: 'NOT_FOUND',
    });
  }

  // Calculate attendance rate
  const totalAttendanceCount = user.attendanceRecords.length;
  const presentCount = user.attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const attendancePercentage = totalAttendanceCount > 0 ? Math.round((presentCount / totalAttendanceCount) * 100) : 100;

  return res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      departmentId: user.departmentId,
      departmentName: user.department?.name,
      phone: user.phone,
      rollNumber: user.rollNumber,
      semester: user.semester,
      skills: user.skills,
      linkedinUrl: user.linkedinUrl,
      githubUrl: user.githubUrl,
      resumeUrl: user.resumeUrl,
      bio: user.bio,
      attendancePercentage,
      recentAttendance: user.attendanceRecords,
      recentSubmissions: user.submissions,
      eventRegistrations: user.eventRegistrations,
      applications: user.applications,
      clubMemberships: user.clubMemberships,
    },
  });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const data = UpdateProfileSchema.parse(req.body);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.linkedinUrl !== undefined && { linkedinUrl: data.linkedinUrl }),
      ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl }),
      ...(data.resumeUrl !== undefined && { resumeUrl: data.resumeUrl }),
      ...(data.skills && { skills: data.skills }),
    },
    include: { department: true },
  });

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: updatedUser,
  });
};

export const uploadAvatar = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
      code: 'MISSING_FILE',
    });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;

  await prisma.user.update({
    where: { id: req.user!.userId },
    data: { avatarUrl },
  });

  return res.status(200).json({
    success: true,
    message: 'Avatar uploaded successfully.',
    data: { avatarUrl },
  });
};
