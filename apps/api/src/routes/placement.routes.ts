import { Router } from 'express';
import {
  createPlacement,
  listPlacements,
  applyForPlacement,
  updateApplicationStatus,
} from '../controllers/placement.controller';
import { requireAuth, requireRole } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', requireAuth, listPlacements);
router.post('/', requireAuth, requireRole(['COORDINATOR', 'ADMIN']), createPlacement);
router.post('/:placementId/apply', requireAuth, requireRole(['STUDENT']), upload.single('resume'), applyForPlacement);
router.put('/applications/:applicationId/status', requireAuth, requireRole(['COORDINATOR', 'ADMIN']), updateApplicationStatus);

export default router;
