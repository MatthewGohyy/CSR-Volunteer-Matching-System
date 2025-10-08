import { Router } from 'express';
import { MatchController } from '../controllers/match.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Offer management (PIN only)
router.post('/offers/:offerId/accept', MatchController.acceptOffer);
router.post('/offers/:offerId/decline', MatchController.declineOffer);
router.get('/offers', MatchController.getOffersForMyRequests);

// Match management (both PIN and CSR Rep)
router.put('/:matchId/complete', MatchController.completeMatch);
router.put('/:matchId/cancel', MatchController.cancelMatch);

export default router;
