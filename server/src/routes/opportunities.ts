import { Router } from 'express';
import { GetCategoriesController } from '../controllers/common/getCategories.controller';
import { CreateRequestController } from '../controllers/pin/createRequest.controller';
import { ViewMyRequestsController } from '../controllers/pin/viewMyRequests.controller';
import { UpdateRequestController } from '../controllers/pin/updateRequest.controller';
import { DeleteRequestController } from '../controllers/pin/deleteRequest.controller';
import { SearchMyRequestsController } from '../controllers/pin/searchMyRequests.controller';
import { ViewRequestViewsController } from '../controllers/pin/viewRequestViews.controller';
import { ViewRequestShortlistsController } from '../controllers/pin/viewRequestShortlists.controller';
import { SearchRequestsController as CSRSearchRequestsController } from '../controllers/csrRep/searchRequests.controller';
import { ViewRequestsController as CSRViewRequestsController } from '../controllers/csrRep/viewRequests.controller';
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
router.get('/categories', GetCategoriesController.handle);

// CSR Rep routes - Search and view requests (Stories #26, #27)
router.get(
  '/search',
  authenticate,
  authorize(UserType.CSR_REP),
  CSRSearchRequestsController.handle
);
router.get(
  '/',
  authenticate,
  authorize(UserType.CSR_REP),
  CSRViewRequestsController.handle
);
router.get(
  '/:id',
  authenticate,
  authorize(UserType.CSR_REP),
  validate(requestIdValidation),
  CSRViewRequestsController.handle
);

// PIN routes - My requests management (Stories #15-#21)
// Story #19: Search my requests
router.get(
  '/my/search',
  authenticate,
  authorize(UserType.PIN),
  SearchMyRequestsController.handle
);

// Story #16: View my requests
router.get(
  '/my/requests',
  authenticate,
  authorize(UserType.PIN),
  ViewMyRequestsController.handle
);

// Story #20: View request views count
router.get(
  '/my/:id/views',
  authenticate,
  authorize(UserType.PIN),
  validate(requestIdValidation),
  ViewRequestViewsController.handle
);

// Story #21: View request shortlists count
router.get(
  '/my/:id/shortlists',
  authenticate,
  authorize(UserType.PIN),
  validate(requestIdValidation),
  ViewRequestShortlistsController.handle
);

// Story #15: Create request
router.post(
  '/',
  authenticate,
  authorize(UserType.PIN),
  validate(createRequestValidation),
  CreateRequestController.handle
);

// Story #17: Update request
router.put(
  '/:id',
  authenticate,
  authorize(UserType.PIN),
  validate(updateRequestValidation),
  UpdateRequestController.handle
);

// Story #18: Delete request
router.delete(
  '/:id',
  authenticate,
  authorize(UserType.PIN),
  validate(requestIdValidation),
  DeleteRequestController.handle
);

export default router;
