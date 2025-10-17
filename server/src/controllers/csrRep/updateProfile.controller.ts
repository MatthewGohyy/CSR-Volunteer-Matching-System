import { Response, NextFunction } from 'express';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for updating CSR Rep profile
 * User Story: Update my CSR Representative profile information
 */
export class UpdateProfileController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { industry, contactPerson, phoneNumber, companyAddress, companyLogo } = req.body;

      // Get CSR Rep profile

      const csrRep = await CSRRepEntity.findByUserId(userId);
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      const updateData: any = {};
      if (industry) updateData.industry = industry;
      if (contactPerson) updateData.contactPerson = contactPerson;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
      if (companyAddress) updateData.companyAddress = companyAddress;
      if (companyLogo) updateData.companyLogo = companyLogo;

      const updated = await CSRRepEntity.updateByUserId(userId, updateData);

      res.json({
        message: 'Profile updated successfully',
        profile: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
