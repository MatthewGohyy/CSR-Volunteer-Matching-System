import { Router } from 'express';
import { CompleteMatchController } from '../controllers/matches/completeMatch.controller';
import { CancelMatchController } from '../controllers/matches/cancelMatch.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Match management (both PIN and CSR Rep can complete/cancel)
router.put('/:matchId/complete', CompleteMatchController.handle);
router.put('/:matchId/cancel', CancelMatchController.handle);

export default router;
