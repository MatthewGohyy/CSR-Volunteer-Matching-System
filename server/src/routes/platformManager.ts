import { Router } from 'express';
import { PlatformManagerController } from '../controllers/platformManager.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserType } from '@prisma/client';
import { body, param, query } from 'express-validator';

const router = Router();

// Validation rules
const createCategoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('description').optional().trim(),
  body('icon').optional().trim(),
];

const updateCategoryValidation = [
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
  body('description').optional().trim(),
  body('icon').optional().trim(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const categoryIdValidation = [
  param('id').isUUID().withMessage('Valid category ID is required'),
];

// All routes require Platform Manager authentication
router.use(authenticate, authorize(UserType.PLATFORM_MANAGER));

// Category management
router.post('/categories', validate(createCategoryValidation), PlatformManagerController.createCategory);
router.get('/categories', PlatformManagerController.getCategories);
router.get('/categories/search', PlatformManagerController.searchCategories);
router.get('/categories/:id', validate(categoryIdValidation), PlatformManagerController.getCategory);
router.put('/categories/:id', validate([...categoryIdValidation, ...updateCategoryValidation]), PlatformManagerController.updateCategory);
router.delete('/categories/:id', validate(categoryIdValidation), PlatformManagerController.deleteCategory);

// Platform statistics/reports
router.get('/stats', PlatformManagerController.getPlatformStats);

// Profile management
router.get('/profile', PlatformManagerController.getProfile);
router.put('/profile', PlatformManagerController.updateProfile);

export default router;

