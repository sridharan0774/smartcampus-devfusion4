import { Router } from 'express';
import { exportAttendanceReport, exportPlacementsReport } from '../controllers/report.controller';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/attendance', requireAuth, requireRole(['COORDINATOR', 'ADMIN']), exportAttendanceReport);
router.get('/placements', requireAuth, requireRole(['COORDINATOR', 'ADMIN']), exportPlacementsReport);

export default router;
