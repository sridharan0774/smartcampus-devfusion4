import { Router } from 'express';
import {
  createEvent,
  listEvents,
  registerForEvent,
  cancelRegistration,
  getEventTicket,
} from '../controllers/event.controller';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, listEvents);
router.post('/', requireAuth, requireRole(['COORDINATOR', 'ADMIN']), createEvent);
router.post('/:eventId/register', requireAuth, requireRole(['STUDENT']), registerForEvent);
router.delete('/:eventId/register', requireAuth, requireRole(['STUDENT']), cancelRegistration);
router.get('/:eventId/ticket', requireAuth, getEventTicket);

export default router;
