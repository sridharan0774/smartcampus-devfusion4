import { Router } from 'express';
import {
  listUsers,
  updateUserRole,
  deleteUser,
  listAuditLogs,
  getSettings,
  updateSettings,
} from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.use(requireAuth, requireRole(['ADMIN']));

router.get('/users', listUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/logs', listAuditLogs);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
