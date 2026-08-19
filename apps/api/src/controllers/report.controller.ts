import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { generateCSVBuffer, generateExcelBuffer } from '../utils/csv';

export const exportAttendanceReport = async (req: AuthenticatedRequest, res: Response) => {
  const format = (req.query.format as string) || 'csv';

  const attendances = await prisma.attendance.findMany({
    include: {
      student: { select: { name: true, email: true, rollNumber: true } },
      session: {
        include: { subject: { select: { name: true, code: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const reportData = attendances.map(a => ({
    'Student Name': a.student.name,
    'Roll Number': a.student.rollNumber || 'N/A',
    'Email': a.student.email,
    'Subject Code': a.session.subject.code,
    'Subject Name': a.session.subject.name,
    'Date': a.session.date.toISOString().split('T')[0],
    'Status': a.status,
    'Remarks': a.remarks || '',
  }));

  if (format === 'excel' || format === 'xlsx') {
    const buffer = generateExcelBuffer(reportData, 'Attendance Report');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=SmartCampus_Attendance_Report.xlsx');
    return res.send(buffer);
  }

  const buffer = generateCSVBuffer(reportData);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=SmartCampus_Attendance_Report.csv');
  return res.send(buffer);
};

export const exportPlacementsReport = async (req: AuthenticatedRequest, res: Response) => {
  const format = (req.query.format as string) || 'csv';

  const applications = await prisma.application.findMany({
    include: {
      student: { select: { name: true, email: true, rollNumber: true } },
      placement: { select: { companyName: true, jobRole: true, ctc: true } },
    },
    orderBy: { appliedAt: 'desc' },
  });

  const reportData = applications.map(a => ({
    'Student Name': a.student.name,
    'Roll Number': a.student.rollNumber || 'N/A',
    'Email': a.student.email,
    'Company': a.placement.companyName,
    'Job Role': a.placement.jobRole,
    'Package (CTC)': a.placement.ctc,
    'Application Status': a.status,
    'Applied Date': a.appliedAt.toISOString().split('T')[0],
  }));

  if (format === 'excel' || format === 'xlsx') {
    const buffer = generateExcelBuffer(reportData, 'Placements Report');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=SmartCampus_Placements_Report.xlsx');
    return res.send(buffer);
  }

  const buffer = generateCSVBuffer(reportData);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=SmartCampus_Placements_Report.csv');
  return res.send(buffer);
};
