import { Router } from 'express';
import { PINController } from '../controllers/pin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserType } from '@prisma/client';

const router = Router();

// All routes require PIN authentication
router.use(authenticate, authorize(UserType.PIN));

// Profile management
router.get('/profile', PINController.getProfile);
router.put('/profile', PINController.updateProfile);

// Matches
router.get('/matches', PINController.getMyMatches);

// Notifications
router.get('/notifications', PINController.getNotifications);
router.put('/notifications/:notificationId/read', PINController.markNotificationRead);
router.put('/notifications/read-all', PINController.markAllNotificationsRead);

export default router;
