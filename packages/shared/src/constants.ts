export const ROLES = {
  STUDENT: 'STUDENT',
  FACULTY: 'FACULTY',
  COORDINATOR: 'COORDINATOR',
  ADMIN: 'ADMIN',
} as const;

export const DEFAULT_ATTENDANCE_WARNING_THRESHOLD = 75; // 75% attendance rule

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    GOOGLE: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
  },
  STUDENTS: '/api/students',
  FACULTY: '/api/faculty',
  DEPARTMENTS: '/api/departments',
  COURSES: '/api/courses',
  ATTENDANCE: '/api/attendance',
  ASSIGNMENTS: '/api/assignments',
  SUBMISSIONS: '/api/submissions',
  EVENTS: '/api/events',
  EVENT_REGISTRATIONS: '/api/event-registrations',
  PLACEMENTS: '/api/placements',
  APPLICATIONS: '/api/applications',
  CLUBS: '/api/clubs',
  ANNOUNCEMENTS: '/api/announcements',
  NOTIFICATIONS: '/api/notifications',
  SEARCH: '/api/search',
  ANALYTICS: '/api/analytics',
  REPORTS: '/api/reports',
  ADMIN: '/api/admin',
  SETTINGS: '/api/settings',
};
