import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserType } from '@prisma/client';

const router = Router();

// All routes require admin authentication
router.use(authenticate, authorize(UserType.ADMIN));

// User management routes
router.get('/users', AdminController.getUsers);
router.get('/users/search', AdminController.searchUsers);
router.get('/users/:id', AdminController.getUserById);
router.post('/users', AdminController.createUser);
router.put('/users/:id', AdminController.updateUser);
router.put('/users/:id/status', AdminController.updateUserStatus);
router.delete('/users/:id', AdminController.deleteUser);

// Profile management routes
router.put('/users/:id/profile/pin', AdminController.updatePINProfile);
router.put('/users/:id/profile/csr-rep', AdminController.updateCSRRepProfile);
router.put('/users/:id/profile/platform-manager', AdminController.updatePlatformManagerProfile);

// System statistics
router.get('/stats', AdminController.getSystemStats);

export default router;
