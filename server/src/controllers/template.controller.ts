import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
// import { YourRepository } from '../repositories/YourModel.repository';

/**
 * [Feature Name] Controller
 * 
 * Story #[Number]: As a [User Type], I want to [Action] so that [Benefit].
 * 
 * @example
 * // Usage in route:
 * import { FeatureNameController } from '../controllers/userType/featureName.controller';
 * router.post('/endpoint', authenticate, authorize(['ROLE']), FeatureNameController.handle);
 */
export class FeatureNameController {
  /**
   * Handle the [feature name] request
   */
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Extract parameters from request
      const { param1, param2 } = req.body;
      const { id } = req.params;
      const userId = (req as any).user?.userId;

      // 2. Validation
      if (!param1) {
        throw new AppError('Parameter is required', 400);
      }

      // 3. Business logic (database operations, calculations, etc.)
      // Example: Replace 'model' with actual Prisma model name (e.g., prisma.user, prisma.request)
      // const result = await prisma.yourModel.create({
      //   data: {
      //     field1: param1,
      //     field2: param2,
      //   },
      // });

      const result = { message: 'Template - replace with actual logic' };

      // 4. Send response
      res.status(201).json({
        message: 'Operation successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

