import { Router } from 'express';
import { createClub, listClubs, requestMembership } from '../controllers/club.controller';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, listClubs);
router.post('/', requireAuth, requireRole(['COORDINATOR', 'ADMIN']), createClub);
router.post('/:clubId/join', requireAuth, requireRole(['STUDENT']), requestMembership);

export default router;
