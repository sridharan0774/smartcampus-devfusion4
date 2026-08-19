import { Router } from 'express';
import { getProfile, updateProfile, uploadAvatar } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/profile', requireAuth, getProfile);
router.get('/profile/:id', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.post('/avatar', requireAuth, upload.single('avatar'), uploadAvatar);

export default router;
