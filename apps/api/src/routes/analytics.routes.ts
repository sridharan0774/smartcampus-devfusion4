import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analytics.controller';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/dashboard', requireAuth, getDashboardAnalytics);

export default router;
