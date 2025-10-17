import { Response, NextFunction } from 'express';
import { PINRepository } from '../../repositories/PIN.repository';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for updating PIN profile
 * User Story: Update my PIN profile information
 */
export class UpdateProfileController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pinRepository = new PINRepository();
      const userId = req.user!.userId;
      const { name, age, location, phoneNumber, accessibilityNeeds, profilePhoto } = req.body;

      const pin = await pinRepository.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (age !== undefined) updateData.age = age;
      if (location) updateData.location = location;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
      if (accessibilityNeeds !== undefined) updateData.accessibilityNeeds = accessibilityNeeds;
      if (profilePhoto) updateData.profilePhoto = profilePhoto;

      const updated = await pinRepository.updateByUserId(userId, updateData);

      res.json({
        message: 'Profile updated successfully',
        profile: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
