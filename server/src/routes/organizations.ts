import { Router } from 'express';
import { SaveRequestController } from '../controllers/csrRep/saveRequest.controller';
import { SearchShortlistController } from '../controllers/csrRep/searchShortlist.controller';
import { ViewShortlistController } from '../controllers/csrRep/viewShortlist.controller';
import { SearchCompletedRequestsController } from '../controllers/csrRep/searchCompletedRequests.controller';
import { ViewCompletedRequestController } from '../controllers/csrRep/viewCompletedRequest.controller';
import { RemoveShortlistController } from '../controllers/csrRep/removeShortlist.controller';
import { GetShortlistedIdsController } from '../controllers/csrRep/getShortlistedIds.controller';
import { SubmitOfferController } from '../controllers/csrRep/submitOffer.controller';
import { SearchOffersController } from '../controllers/csrRep/searchOffers.controller';
import { ViewOfferController } from '../controllers/csrRep/viewOffer.controller';
import { SearchMatchesController } from '../controllers/csrRep/searchMatches.controller';
import { ViewMatchController } from '../controllers/csrRep/viewMatch.controller';
import { UpdateProfileController } from '../controllers/csrRep/updateProfile.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { param } from 'express-validator';

const router = Router();

// All routes require CSR Rep authentication
router.use(authenticate, authorize('CSR Representative'));

// Shortlist management (Stories #28-#30)
// Story #29: Search shortlist (listing/search with optional query)
router.get('/shortlists', SearchShortlistController.handle);

// Story #30: View single shortlist item by ID (for modal/detail view)
router.get('/shortlists/:id', validate([param('id').isUUID()]), ViewShortlistController.handle);

// Get shortlisted request IDs
router.get('/shortlist/ids', GetShortlistedIdsController.handle);

// Story #28: Save request (add to shortlist)
router.post('/shortlist', SaveRequestController.handle);

// Remove from shortlist
router.delete('/shortlist/:requestId', RemoveShortlistController.handle);

// Request history (Stories #31, #32)
// Story #31: Search completed requests history (listing/search with optional query)
router.get('/requests/history', SearchCompletedRequestsController.handle);

// Story #32: View single completed request/match by ID (for modal/detail view)
router.get('/requests/history/:id', validate([param('id').isUUID()]), ViewCompletedRequestController.handle);

// Volunteer offers
router.post('/offers', SubmitOfferController.handle);
// Search offers (listing/search with optional query)
router.get('/offers', SearchOffersController.handle);
// View single offer by ID (for modal/detail view)
router.get('/offers/:id', validate([param('id').isUUID()]), ViewOfferController.handle);

// Matches
// Search matches (listing/search with optional query)
router.get('/matches', SearchMatchesController.handle);
// View single match by ID (for modal/detail view)
router.get('/matches/:id', validate([param('id').isUUID()]), ViewMatchController.handle);

// Profile
router.put('/profile', UpdateProfileController.handle);

export default router;
