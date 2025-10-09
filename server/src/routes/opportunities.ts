import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  createRequestValidation,
  updateRequestValidation,
  requestIdValidation,
} from '../validators/request.validator';
import { UserType } from '@prisma/client';

const router = Router();

// Public routes
router.get('/categories', RequestController.getCategories);
router.get('/', RequestController.getRequests);
router.get('/:id', validate(requestIdValidation), RequestController.getRequest);

// Protected routes - PIN only
router.post(
  '/',
  authenticate,
  authorize(UserType.PIN),
  validate(createRequestValidation),
  RequestController.createRequest
);
router.get(
  '/my/requests',
  authenticate,
  authorize(UserType.PIN),
  RequestController.getMyRequests
);
router.put(
  '/:id',
  authenticate,
  authorize(UserType.PIN),
  validate(updateRequestValidation),
  RequestController.updateRequest
);
router.delete(
  '/:id',
  authenticate,
  authorize(UserType.PIN),
  validate(requestIdValidation),
  RequestController.deleteRequest
);

export default router;
