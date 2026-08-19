import { Router } from 'express';
import { createAnnouncement, listAnnouncements } from '../controllers/announcement.controller';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, listAnnouncements);
router.post('/', requireAuth, requireRole(['FACULTY', 'COORDINATOR', 'ADMIN']), createAnnouncement);

export default router;
