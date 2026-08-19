import { Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { CreateAttendanceSessionSchema, MarkAttendanceSchema } from '@smartcampus/shared';
import { AttendanceStatus } from '@prisma/client';

export const createSession = async (req: AuthenticatedRequest, res: Response) => {
  const data = CreateAttendanceSessionSchema.parse(req.body);
  const facultyId = req.user!.userId;

  const subject = await prisma.subject.findUnique({
    where: { id: data.subjectId },
  });

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found',
      code: 'NOT_FOUND',
    });
  }

  const qrToken = `QR-ATTENDANCE-${crypto.randomBytes(16).toString('hex')}`;
  const qrExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

  const session = await prisma.attendanceSession.create({
    data: {
      subjectId: data.subjectId,
      facultyId,
      date: data.date ? new Date(data.date) : new Date(),
      qrCodeToken: qrToken,
      qrExpiresAt,
    },
    include: { subject: true },
  });

  return res.status(201).json({
    success: true,
    message: 'Attendance session created successfully.',
    data: session,
  });
};

export const markAttendance = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId, records } = MarkAttendanceSchema.parse(req.body);

  const session = await prisma.attendanceSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Attendance session not found',
      code: 'NOT_FOUND',
    });
  }

  // Bulk upsert attendance records
  const updatePromises = records.map((record: any) =>
    prisma.attendance.upsert({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId: record.studentId,
        },
      },
      update: {
        status: record.status as AttendanceStatus,
        remarks: record.remarks,
      },
      create: {
        sessionId,
        studentId: record.studentId,
        status: record.status as AttendanceStatus,
        remarks: record.remarks,
      },
    })
  );

  await Promise.all(updatePromises);

  return res.status(200).json({
    success: true,
    message: 'Attendance records saved successfully.',
  });
};

export const markAttendanceViaQR = async (req: AuthenticatedRequest, res: Response) => {
  const { qrToken } = req.body;
  const studentId = req.user!.userId;

  if (!qrToken) {
    return res.status(400).json({
      success: false,
      message: 'QR token is required',
      code: 'MISSING_TOKEN',
    });
  }

  const session = await prisma.attendanceSession.findUnique({
    where: { qrCodeToken: qrToken },
    include: { subject: true },
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Invalid or expired QR attendance session.',
      code: 'INVALID_QR_TOKEN',
    });
  }

  if (session.qrExpiresAt && session.qrExpiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'This QR attendance session has expired.',
      code: 'SESSION_EXPIRED',
    });
  }

  const attendance = await prisma.attendance.upsert({
    where: {
      sessionId_studentId: {
        sessionId: session.id,
        studentId,
      },
    },
    update: {
      status: AttendanceStatus.PRESENT,
      remarks: 'Marked via QR Code Scan',
    },
    create: {
      sessionId: session.id,
      studentId,
      status: AttendanceStatus.PRESENT,
      remarks: 'Marked via QR Code Scan',
    },
  });

  return res.status(200).json({
    success: true,
    message: `Attendance marked PRESENT for ${session.subject.name}!`,
    data: attendance,
  });
};

export const getStudentAttendanceSummary = async (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.params.studentId || req.user!.userId;

  const records = await prisma.attendance.findMany({
    where: { studentId },
    include: {
      session: {
        include: {
          subject: true,
          faculty: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalSessions = records.length;
  const presentCount = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
  const lateCount = records.filter(r => r.status === AttendanceStatus.LATE).length;
  const absentCount = records.filter(r => r.status === AttendanceStatus.ABSENT).length;

  const overallPercentage = totalSessions > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalSessions) * 100) : 100;
  const isLowAttendance = overallPercentage < 75;

  // Subject breakdown
  const subjectMap: Record<string, { subjectName: string; total: number; present: number; percentage: number }> = {};

  records.forEach(r => {
    const subName = r.session.subject.name;
    if (!subjectMap[subName]) {
      subjectMap[subName] = { subjectName: subName, total: 0, present: 0, percentage: 0 };
    }
    subjectMap[subName].total += 1;
    if (r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE) {
      subjectMap[subName].present += 1;
    }
  });

  Object.values(subjectMap).forEach(sub => {
    sub.percentage = Math.round((sub.present / sub.total) * 100);
  });

  return res.status(200).json({
    success: true,
    data: {
      studentId,
      totalSessions,
      presentCount,
      lateCount,
      absentCount,
      overallPercentage,
      isLowAttendance,
      warningThreshold: 75,
      subjectBreakdown: Object.values(subjectMap),
      records: records.slice(0, 30),
    },
  });
};

export const getFacultySessions = async (req: AuthenticatedRequest, res: Response) => {
  const facultyId = req.user!.userId;

  const sessions = await prisma.attendanceSession.findMany({
    where: { facultyId },
    include: {
      subject: true,
      _count: { select: { records: true } },
    },
    orderBy: { date: 'desc' },
  });

  return res.status(200).json({
    success: true,
    data: sessions,
  });
};
