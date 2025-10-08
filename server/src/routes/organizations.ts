import { Router } from 'express';
import { CSRRepController } from '../controllers/csrRep.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserType } from '@prisma/client';

const router = Router();

// All routes require CSR Rep authentication
router.use(authenticate, authorize(UserType.CSR_REP));

// Shortlist management
router.post('/shortlist', CSRRepController.shortlistRequest);
router.delete('/shortlist/:requestId', CSRRepController.removeShortlist);
router.get('/shortlists', CSRRepController.getShortlists);

// Volunteer offers
router.post('/offers', CSRRepController.submitOffer);
router.get('/offers', CSRRepController.getMyOffers);

// Matches
router.get('/matches', CSRRepController.getMyMatches);

// Profile
router.put('/profile', CSRRepController.updateProfile);

export default router;
