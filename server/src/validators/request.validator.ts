import { body, param } from 'express-validator';

export const createRequestValidation = [
  body('categoryId').isUUID().withMessage('Valid category ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('urgency').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid urgency level'),
  body('dateNeeded').notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Valid date is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

export const updateRequestValidation = [
  param('id').isUUID().withMessage('Valid request ID is required'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('categoryId').optional().isUUID().withMessage('Valid category ID is required'),
  body('urgency').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid urgency level'),
  body('dateNeeded').optional().isISO8601().withMessage('Valid date is required'),
  body('location').optional().trim(),
  body('status').optional().isIn(['ACTIVE', 'MATCHED', 'COMPLETED', 'CANCELLED']).withMessage('Invalid status'),
];

export const requestIdValidation = [
  param('id').isUUID().withMessage('Valid request ID is required'),
];

