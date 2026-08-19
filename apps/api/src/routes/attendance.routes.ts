import { Router } from 'express';
import {
  createSession,
  markAttendance,
  markAttendanceViaQR,
  getStudentAttendanceSummary,
  getFacultySessions,
} from '../controllers/attendance.controller';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.post('/sessions', requireAuth, requireRole(['FACULTY', 'ADMIN']), createSession);
router.post('/mark', requireAuth, requireRole(['FACULTY', 'ADMIN']), markAttendance);
router.post('/qr-scan', requireAuth, requireRole(['STUDENT']), markAttendanceViaQR);
router.get('/summary', requireAuth, getStudentAttendanceSummary);
router.get('/summary/:studentId', requireAuth, requireRole(['FACULTY', 'ADMIN']), getStudentAttendanceSummary);
router.get('/faculty-sessions', requireAuth, requireRole(['FACULTY', 'ADMIN']), getFacultySessions);

export default router;
