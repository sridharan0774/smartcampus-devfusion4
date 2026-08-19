export type UserRole = 'STUDENT' | 'FACULTY' | 'COORDINATOR' | 'ADMIN';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'GRADED' | 'LATE';

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export type PlacementStatus = 'OPEN' | 'CLOSED' | 'DRAFT';

export type ApplicationStatus = 
  | 'APPLIED' 
  | 'UNDER_REVIEW' 
  | 'SHORTLISTED' 
  | 'INTERVIEW' 
  | 'SELECTED' 
  | 'REJECTED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type NotificationType = 
  | 'ASSIGNMENT_DUE'
  | 'ASSIGNMENT_GRADED'
  | 'ATTENDANCE_MARKED'
  | 'LOW_ATTENDANCE'
  | 'EVENT_REMINDER'
  | 'EVENT_REGISTRATION'
  | 'PLACEMENT_OPENED'
  | 'APPLICATION_STATUS'
  | 'SYSTEM_ALERT'
  | 'ANNOUNCEMENT';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  error?: any;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  isVerified: boolean;
  departmentId?: string | null;
  departmentName?: string | null;
  phone?: string | null;
  rollNumber?: string | null;
  semester?: number | null;
  skills?: string[];
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  resumeUrl?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentDTO {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  _count?: {
    users?: number;
    courses?: number;
  };
}

export interface CourseDTO {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  departmentName?: string;
  credits: number;
  semester: number;
  _count?: {
    subjects?: number;
  };
}

export interface SubjectDTO {
  id: string;
  code: string;
  name: string;
  courseId: string;
  courseName?: string;
  facultyId?: string | null;
  facultyName?: string | null;
}

export interface AttendanceSessionDTO {
  id: string;
  subjectId: string;
  subjectName?: string;
  facultyId: string;
  facultyName?: string;
  date: string;
  qrCodeToken?: string | null;
  qrExpiresAt?: string | null;
  recordsCount?: number;
  presentCount?: number;
}

export interface AttendanceRecordDTO {
  id: string;
  sessionId: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  subjectName?: string;
  date?: string;
  status: AttendanceStatus;
  remarks?: string | null;
}

export interface AssignmentDTO {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName?: string;
  facultyId: string;
  facultyName?: string;
  deadline: string;
  maxMarks: number;
  isPublished: boolean;
  rubric?: string | null;
  attachments?: { id: string; fileName: string; fileUrl: string }[];
  _count?: {
    submissions?: number;
  };
}

export interface SubmissionDTO {
  id: string;
  assignmentId: string;
  assignmentTitle?: string;
  studentId: string;
  studentName?: string;
  fileUrl?: string | null;
  fileName?: string | null;
  githubUrl?: string | null;
  submittedAt: string;
  status: SubmissionStatus;
  marks?: number | null;
  feedback?: string | null;
  gradedAt?: string | null;
}

export interface EventDTO {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string | null;
  venue: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxSeats: number;
  availableSeats: number;
  status: EventStatus;
  organizerId: string;
  organizerName?: string;
  speakers?: { id: string; name: string; title: string; bio?: string; photoUrl?: string }[];
  isRegistered?: boolean;
  qrPassCode?: string | null;
  _count?: {
    registrations?: number;
  };
}

export interface EventRegistrationDTO {
  id: string;
  eventId: string;
  eventTitle?: string;
  studentId: string;
  studentName?: string;
  qrCodePass: string;
  registeredAt: string;
}

export interface PlacementDTO {
  id: string;
  companyName: string;
  companyLogo?: string | null;
  jobRole: string;
  description: string;
  eligibility: string;
  ctc: string;
  deadline: string;
  status: PlacementStatus;
  hasApplied?: boolean;
  applicationStatus?: ApplicationStatus | null;
  _count?: {
    applications?: number;
  };
}

export interface ApplicationDTO {
  id: string;
  placementId: string;
  companyName?: string;
  jobRole?: string;
  studentId: string;
  studentName?: string;
  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface ClubDTO {
  id: string;
  name: string;
  description: string;
  category: string;
  logoUrl?: string | null;
  coordinatorId: string;
  coordinatorName?: string;
  memberCount: number;
  membershipStatus?: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface AnnouncementDTO {
  id: string;
  title: string;
  content: string;
  priority: Priority;
  targetRole?: UserRole | null;
  departmentId?: string | null;
  departmentName?: string | null;
  authorId: string;
  authorName?: string;
  publishDate: string;
  expiryDate?: string | null;
}

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export interface AuditLogDTO {
  id: string;
  userId: string;
  userName?: string;
  userRole?: string;
  action: string;
  resource: string;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface DashboardStatsDTO {
  totalStudents?: number;
  totalFaculty?: number;
  totalDepartments?: number;
  totalEvents?: number;
  overallAttendancePercentage?: number;
  upcomingEventsCount?: number;
  pendingAssignmentsCount?: number;
  activePlacementsCount?: number;
  monthlyAttendance?: { month: string; percentage: number }[];
  departmentPerformance?: { department: string; averageMarks: number; attendanceRate: number }[];
  assignmentCompletion?: { completed: number; pending: number; late: number }[];
  placementStats?: { company: string; applied: number; selected: number }[];
}
