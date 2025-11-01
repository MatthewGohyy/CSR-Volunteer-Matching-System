import { Router } from 'express';
import { GetCategoriesController } from '../controllers/common/getCategories.controller';
import { CreateRequestController } from '../controllers/pin/createRequest.controller';
import { ViewMyRequestController } from '../controllers/pin/viewMyRequest.controller';
import { UpdateRequestController } from '../controllers/pin/updateRequest.controller';
import { DeleteRequestController } from '../controllers/pin/deleteRequest.controller';
import { SearchMyRequestsController } from '../controllers/pin/searchMyRequests.controller';
import { ViewRequestViewController } from '../controllers/pin/viewRequestViewController';
import { ViewRequestShortlistController } from '../controllers/pin/viewRequestShortlist.controller';
import { SearchRequestsController as CSRSearchRequestsController } from '../controllers/csrRep/searchRequests.controller';
import { ViewRequestController } from '../controllers/csrRep/viewRequest.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  createRequestValidation,
  updateRequestValidation,
  requestIdValidation,
} from '../validators/request.validator';

const router = Router();

// Public routes
router.get('/categories', GetCategoriesController.handle);

// CSR Rep routes - Search and view requests (Stories #26, #27)
// Story #26: Search requests (listing/search with optional filters)
router.get(
  '/',
  authenticate,
  authorize('CSR Representative'),
  CSRSearchRequestsController.handle
);
// Story #27: View single request by ID (for modal/detail view)
router.get(
  '/:id',
  authenticate,
  authorize('CSR Representative'),
  validate(requestIdValidation),
  ViewRequestController.handle
);

// PIN routes - My requests management (Stories #15-#21)
// Story #19: Search my requests (with query parameters)
router.get(
  '/my/search',
  authenticate,
  authorize('Person in Need'),
  SearchMyRequestsController.handle
);

// Story #16: View my requests (list all, can have search query)
router.get(
  '/my/requests',
  authenticate,
  authorize('Person in Need'),
  SearchMyRequestsController.handle
);

// Story #16: View my request (singular by ID)
router.get(
  '/my/requests/:id',
  authenticate,
  authorize('Person in Need'),
  validate(requestIdValidation),
  ViewMyRequestController.handle
);

// Story #20: View request views count
router.get(
  '/my/:id/views',
  authenticate,
  authorize('Person in Need'),
  validate(requestIdValidation),
  ViewRequestViewController.handle
);

// Story #21: View request shortlists count
router.get(
  '/my/:id/shortlists',
  authenticate,
  authorize('Person in Need'),
  validate(requestIdValidation),
  ViewRequestShortlistController.handle
);

// Story #15: Create request
router.post(
  '/',
  authenticate,
  authorize('Person in Need'),
  validate(createRequestValidation),
  CreateRequestController.handle
);

// Story #17: Update request
router.put(
  '/:id',
  authenticate,
  authorize('Person in Need'),
  validate(updateRequestValidation),
  UpdateRequestController.handle
);

// Story #18: Delete request
router.delete(
  '/:id',
  authenticate,
  authorize('Person in Need'),
  validate(requestIdValidation),
  DeleteRequestController.handle
);

export default router;
