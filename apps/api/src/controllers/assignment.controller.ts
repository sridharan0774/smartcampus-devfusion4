import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { CreateAssignmentSchema, SubmitAssignmentSchema, GradeSubmissionSchema } from '@smartcampus/shared';
import { SubmissionStatus } from '@prisma/client';

export const createAssignment = async (req: AuthenticatedRequest, res: Response) => {
  const data = CreateAssignmentSchema.parse(req.body);
  const facultyId = req.user!.userId;

  const assignment = await prisma.assignment.create({
    data: {
      title: data.title,
      description: data.description,
      subjectId: data.subjectId,
      facultyId,
      deadline: new Date(data.deadline),
      maxMarks: data.maxMarks,
      rubric: data.rubric || null,
      isPublished: true,
    },
    include: {
      subject: true,
      attachments: true,
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Assignment created successfully.',
    data: assignment,
  });
};

export const listAssignments = async (req: AuthenticatedRequest, res: Response) => {
  const assignments = await prisma.assignment.findMany({
    where: { isPublished: true },
    include: {
      subject: true,
      faculty: { select: { id: true, name: true, email: true } },
      attachments: true,
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // If student, attach their submission status for each assignment
  if (req.user?.role === 'STUDENT') {
    const studentSubmissions = await prisma.assignmentSubmission.findMany({
      where: { studentId: req.user.userId },
    });

    const subMap = new Map(studentSubmissions.map(s => [s.assignmentId, s]));

    const enriched = assignments.map(a => ({
      ...a,
      mySubmission: subMap.get(a.id) || null,
    }));

    return res.status(200).json({ success: true, data: enriched });
  }

  return res.status(200).json({ success: true, data: assignments });
};

export const getAssignmentById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      subject: true,
      faculty: { select: { id: true, name: true, email: true } },
      attachments: true,
      submissions: {
        include: {
          student: { select: { id: true, name: true, email: true, rollNumber: true } },
        },
      },
    },
  });

  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: 'Assignment not found',
      code: 'NOT_FOUND',
    });
  }

  return res.status(200).json({
    success: true,
    data: assignment,
  });
};

export const submitAssignment = async (req: AuthenticatedRequest, res: Response) => {
  const data = SubmitAssignmentSchema.parse(req.body);
  const studentId = req.user!.userId;

  const assignment = await prisma.assignment.findUnique({
    where: { id: data.assignmentId },
  });

  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: 'Assignment not found',
      code: 'NOT_FOUND',
    });
  }

  let fileUrl = data.fileUrl;
  let fileName = data.fileName;

  if (req.file) {
    fileUrl = `/uploads/${req.file.filename}`;
    fileName = req.file.originalname;
  }

  const now = new Date();
  const isLate = now > assignment.deadline;
  const status: SubmissionStatus = isLate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED;

  const submission = await prisma.assignmentSubmission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId: data.assignmentId,
        studentId,
      },
    },
    update: {
      fileUrl,
      fileName,
      githubUrl: data.githubUrl || null,
      submittedAt: now,
      status,
    },
    create: {
      assignmentId: data.assignmentId,
      studentId,
      fileUrl,
      fileName,
      githubUrl: data.githubUrl || null,
      submittedAt: now,
      status,
    },
  });

  return res.status(200).json({
    success: true,
    message: isLate ? 'Assignment submitted (LATE).' : 'Assignment submitted successfully ON TIME!',
    data: submission,
  });
};

export const gradeSubmission = async (req: AuthenticatedRequest, res: Response) => {
  const { submissionId } = req.params;
  const { marks, feedback } = GradeSubmissionSchema.parse(req.body);

  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found',
      code: 'NOT_FOUND',
    });
  }

  const updated = await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      marks,
      feedback: feedback || null,
      status: SubmissionStatus.GRADED,
      gradedAt: new Date(),
    },
  });

  // Create notification for student
  await prisma.notification.create({
    data: {
      userId: submission.studentId,
      type: 'ASSIGNMENT_GRADED',
      title: 'Assignment Graded',
      message: `Your submission was graded: ${marks} marks.`,
      link: '/assignments',
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Submission graded successfully.',
    data: updated,
  });
};
