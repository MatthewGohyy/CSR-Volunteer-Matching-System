import { Router } from 'express';
import { SaveRequestController } from '../controllers/csrRep/saveRequest.controller';
import { SearchShortlistController } from '../controllers/csrRep/searchShortlist.controller';
import { ViewShortlistController } from '../controllers/csrRep/viewShortlist.controller';
import { SearchCompletedRequestsController } from '../controllers/csrRep/searchCompletedRequests.controller';
import { ViewCompletedRequestsController } from '../controllers/csrRep/viewCompletedRequests.controller';
import { RemoveShortlistController } from '../controllers/csrRep/removeShortlist.controller';
import { SubmitOfferController } from '../controllers/csrRep/submitOffer.controller';
import { ViewOffersController } from '../controllers/csrRep/viewOffers.controller';
import { ViewMatchesController } from '../controllers/csrRep/viewMatches.controller';
import { UpdateProfileController } from '../controllers/csrRep/updateProfile.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes require CSR Rep authentication
router.use(authenticate, authorize('CSR Representative'));

// Shortlist management (Stories #28-#30)
// Story #29: Search shortlist
router.get('/shortlist/search', SearchShortlistController.handle);

// Story #30: View shortlist
router.get('/shortlists', ViewShortlistController.handle);

// Story #28: Save request (add to shortlist)
router.post('/shortlist', SaveRequestController.handle);

// Remove from shortlist
router.delete('/shortlist/:requestId', RemoveShortlistController.handle);

// Request history (Stories #31, #32)
// Story #31: Search completed requests history
router.get('/requests/history/search', SearchCompletedRequestsController.handle);

// Story #32: View completed requests history
router.get('/requests/history', ViewCompletedRequestsController.handle);

// Volunteer offers
router.post('/offers', SubmitOfferController.handle);
router.get('/offers', ViewOffersController.handle);

// Matches
router.get('/matches', ViewMatchesController.handle);

// Profile
router.put('/profile', UpdateProfileController.handle);

export default router;
