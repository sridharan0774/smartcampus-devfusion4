import { Router } from 'express';
import {
  createAssignment,
  listAssignments,
  getAssignmentById,
  submitAssignment,
  gradeSubmission,
} from '../controllers/assignment.controller';
import { requireAuth, requireRole } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', requireAuth, listAssignments);
router.get('/:id', requireAuth, getAssignmentById);
router.post('/', requireAuth, requireRole(['FACULTY', 'ADMIN']), createAssignment);
router.post('/submit', requireAuth, requireRole(['STUDENT']), upload.single('file'), submitAssignment);
router.put('/submissions/:submissionId/grade', requireAuth, requireRole(['FACULTY', 'ADMIN']), gradeSubmission);

export default router;
