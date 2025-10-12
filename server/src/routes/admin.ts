import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserType } from '@prisma/client';

const router = Router();

// All routes require admin authentication
router.use(authenticate, authorize(UserType.ADMIN));

// User management routes
router.get('/users', AdminController.getUsers);
router.get('/users/:id', AdminController.getUserById);
router.post('/users', AdminController.createUser);
router.put('/users/:id/status', AdminController.updateUserStatus);
router.put('/users/:id/approve', AdminController.approveCSRRep);
router.delete('/users/:id', AdminController.deleteUser);

// Specialized routes
router.get('/users/pending-csr-reps', AdminController.getPendingCSRReps);

// System statistics
router.get('/stats', AdminController.getSystemStats);

export default router;
