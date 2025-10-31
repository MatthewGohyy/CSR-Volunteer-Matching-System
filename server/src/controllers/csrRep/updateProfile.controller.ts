import { Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';
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

      const updateData: any = {};
      if (industry) updateData.industry = industry;
      if (contactPerson) updateData.contactPerson = contactPerson;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
      if (companyAddress) updateData.companyAddress = companyAddress;
      if (companyLogo) updateData.companyLogo = companyLogo;

      const updated = await UserAccount.updateCSRRepProfile(userId, updateData);

      res.json({
        message: 'Profile updated successfully',
        profile: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
