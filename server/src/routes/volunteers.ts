import { Router } from 'express';
import { GetProfileController } from '../controllers/pin/getProfile.controller';
import { UpdateProfileController } from '../controllers/pin/updateProfile.controller';
import { ViewMatchesController } from '../controllers/pin/viewMatches.controller';
import { GetNotificationsController } from '../controllers/pin/getNotifications.controller';
import { MarkNotificationReadController } from '../controllers/pin/markNotificationRead.controller';
import { MarkAllNotificationsReadController } from '../controllers/pin/markAllNotificationsRead.controller';
import { SearchCompletedRequestsController } from '../controllers/pin/searchCompletedRequests.controller';
import { ViewCompletedRequestsController } from '../controllers/pin/viewCompletedRequests.controller';
import { ViewOffersController } from '../controllers/pin/viewOffers.controller';
import { AcceptOfferController } from '../controllers/pin/acceptOffer.controller';
import { DeclineOfferController } from '../controllers/pin/declineOffer.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { requestIdValidation } from '../validators/request.validator';

const router = Router();

// All routes require PIN authentication
router.use(authenticate, authorize('Person in Need'));

// Profile management
router.get('/profile', GetProfileController.handle);
router.put('/profile', UpdateProfileController.handle);

// Volunteer Offers (NEW)
router.get('/offers', ViewOffersController.handle);
router.put('/offers/:offerId/accept', AcceptOfferController.handle);
router.put('/offers/:offerId/decline', DeclineOfferController.handle);

// Matches
router.get('/matches', ViewMatchesController.handle);

// Notifications
router.get('/notifications', GetNotificationsController.handle);
router.put('/notifications/:notificationId/read', MarkNotificationReadController.handle);
router.put('/notifications/read-all', MarkAllNotificationsReadController.handle);

// Request history (Stories #22, #23)
// Story #22: Search completed requests history (must be before :id route)
router.get('/requests/history/search', SearchCompletedRequestsController.handle);

// Story #23: View all completed requests history (handled by SearchCompletedRequestsController when no query)
router.get('/requests/history', SearchCompletedRequestsController.handle);

// Story #23: View single completed request details (by ID)
router.get('/requests/history/:id', validate(requestIdValidation), ViewCompletedRequestsController.handle);

export default router;
