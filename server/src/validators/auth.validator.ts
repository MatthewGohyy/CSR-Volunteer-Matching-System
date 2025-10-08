import { body } from 'express-validator';

export const registerPINValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('age').optional().isInt({ min: 0, max: 150 }).withMessage('Valid age is required'),
  body('location').optional().trim(),
  body('phoneNumber').optional().trim(),
  body('accessibilityNeeds').optional().trim(),
];

export const registerCSRRepValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('companyRegistrationNumber')
    .trim()
    .notEmpty()
    .withMessage('Company registration number is required'),
  body('industry').optional().trim(),
  body('contactPerson').trim().notEmpty().withMessage('Contact person is required'),
  body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
  body('companyAddress').optional().trim(),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

