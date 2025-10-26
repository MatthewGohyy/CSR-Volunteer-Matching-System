import { Router } from 'express';
import { GetProfileController } from '../controllers/pin/getProfile.controller';
import { UpdateProfileController } from '../controllers/pin/updateProfile.controller';
import { ViewMatchesController } from '../controllers/pin/viewMatches.controller';
import { GetNotificationsController } from '../controllers/pin/getNotifications.controller';
import { MarkNotificationReadController } from '../controllers/pin/markNotificationRead.controller';
import { MarkAllNotificationsReadController } from '../controllers/pin/markAllNotificationsRead.controller';
import { SearchCompletedRequestsController } from '../controllers/pin/searchCompletedRequests.controller';
import { ViewCompletedRequestsController } from '../controllers/pin/viewCompletedRequests.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserProfileRole } from '@prisma/client';

const router = Router();

// All routes require PIN authentication
router.use(authenticate, authorize(UserProfileRole.PIN));

// Profile management
router.get('/profile', GetProfileController.handle);
router.put('/profile', UpdateProfileController.handle);

// Matches
router.get('/matches', ViewMatchesController.handle);

// Notifications
router.get('/notifications', GetNotificationsController.handle);
router.put('/notifications/:notificationId/read', MarkNotificationReadController.handle);
router.put('/notifications/read-all', MarkAllNotificationsReadController.handle);

// Request history (Stories #22, #23)
// Story #22: Search completed requests history
router.get('/requests/history/search', SearchCompletedRequestsController.handle);

// Story #23: View completed requests history
router.get('/requests/history', ViewCompletedRequestsController.handle);

export default router;
