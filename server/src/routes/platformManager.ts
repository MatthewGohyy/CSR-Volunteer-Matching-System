import { Router } from 'express';
import { CreateCategoryController } from '../controllers/platformManager/createCategory.controller';
import { ViewCategoriesController } from '../controllers/platformManager/viewCategories.controller';
import { UpdateCategoryController } from '../controllers/platformManager/updateCategory.controller';
import { DeleteCategoryController } from '../controllers/platformManager/deleteCategory.controller';
import { SearchCategoriesController } from '../controllers/platformManager/searchCategories.controller';
import { GetPlatformStatsController } from '../controllers/platformManager/getPlatformStats.controller';
import { GetProfileController } from '../controllers/platformManager/getProfile.controller';
import { UpdateProfileController } from '../controllers/platformManager/updateProfile.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { body, param, query } from 'express-validator';

const router = Router();

// Validation rules
const createCategoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('description').optional().trim(),
  body('iconUrl').optional().trim().isURL().withMessage('Icon URL must be a valid URL'),
];

const updateCategoryValidation = [
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
  body('description').optional().trim(),
  body('iconUrl').optional().trim().isURL().withMessage('Icon URL must be a valid URL'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const categoryIdValidation = [
  param('id').isUUID().withMessage('Valid category ID is required'),
];

// All routes require Platform Manager authentication
router.use(authenticate, authorize('Platform Manager'));

// Category management routes (Stories #35-#39)
// Story #39: Search categories (must be before :id route to avoid conflicts)
router.get('/categories/search', SearchCategoriesController.handle);

// Story #36: View categories
router.get('/categories', ViewCategoriesController.handle);
router.get('/categories/:id', validate(categoryIdValidation), ViewCategoriesController.handle);

// Story #35: Create category
router.post('/categories', validate(createCategoryValidation), CreateCategoryController.handle);

// Story #37: Update category
router.put('/categories/:id', validate([...categoryIdValidation, ...updateCategoryValidation]), UpdateCategoryController.handle);

// Story #38: Delete category
router.delete('/categories/:id', validate(categoryIdValidation), DeleteCategoryController.handle);

// Platform statistics/reports (utility - not a user story)
router.get('/stats', GetPlatformStatsController.handle);

// Profile management (utility - not a user story)
router.get('/profile', GetProfileController.handle);
router.put('/profile', UpdateProfileController.handle);

export default router;

