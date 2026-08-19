import { z } from 'zod';

export const UserRoleSchema = z.enum(['STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN']);

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: UserRoleSchema.default('STUDENT'),
  departmentId: z.string().optional(),
  rollNumber: z.string().optional(),
  semester: z.number().min(1).max(10).optional(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  linkedinUrl: z.string().url().or(z.literal('')).optional(),
  githubUrl: z.string().url().or(z.literal('')).optional(),
  resumeUrl: z.string().optional(),
  skills: z.array(z.string()).optional(),
  notificationPreferences: z.record(z.boolean()).optional(),
});

export const CreateAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be detailed'),
  subjectId: z.string().min(1, 'Subject is required'),
  deadline: z.string().datetime().or(z.string().min(10)),
  maxMarks: z.number().positive().default(100),
  rubric: z.string().optional(),
});

export const SubmitAssignmentSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  githubUrl: z.string().url().or(z.literal('')).optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

export const GradeSubmissionSchema = z.object({
  marks: z.number().min(0),
  feedback: z.string().optional(),
});

export const CreateEventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be detailed'),
  bannerUrl: z.string().optional(),
  venue: z.string().min(2, 'Venue is required'),
  startDate: z.string(),
  endDate: z.string(),
  registrationDeadline: z.string(),
  maxSeats: z.number().int().positive(),
  speakers: z.array(z.object({
    name: z.string(),
    title: z.string(),
    bio: z.string().optional(),
    photoUrl: z.string().optional(),
  })).optional(),
});

export const CreatePlacementSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  companyLogo: z.string().optional(),
  jobRole: z.string().min(2, 'Job role is required'),
  description: z.string().min(10, 'Detailed description is required'),
  eligibility: z.string().min(2, 'Eligibility criteria required'),
  ctc: z.string().min(1, 'CTC compensation package required'),
  deadline: z.string(),
});

export const CreateAttendanceSessionSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  date: z.string().optional(),
});

export const MarkAttendanceSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  records: z.array(z.object({
    studentId: z.string(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    remarks: z.string().optional(),
  })),
});

export const CreateAnnouncementSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content must be provided'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  targetRole: UserRoleSchema.nullable().optional(),
  departmentId: z.string().nullable().optional(),
  expiryDate: z.string().optional(),
});

export const CreateClubSchema = z.object({
  name: z.string().min(3, 'Club name is required'),
  description: z.string().min(10, 'Description required'),
  category: z.string().min(2, 'Category required'),
  logoUrl: z.string().optional(),
  coordinatorId: z.string().min(1, 'Coordinator is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type CreateAssignmentInput = z.infer<typeof CreateAssignmentSchema>;
export type SubmitAssignmentInput = z.infer<typeof SubmitAssignmentSchema>;
export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type CreatePlacementInput = z.infer<typeof CreatePlacementSchema>;
export type CreateAttendanceSessionInput = z.infer<typeof CreateAttendanceSessionSchema>;
export type MarkAttendanceInput = z.infer<typeof MarkAttendanceSchema>;
export type CreateAnnouncementInput = z.infer<typeof CreateAnnouncementSchema>;
export type CreateClubInput = z.infer<typeof CreateClubSchema>;
