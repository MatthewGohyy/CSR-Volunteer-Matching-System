import { Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for updating PIN profile
 * User Story: Update my PIN profile information
 */
export class UpdateProfileController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { name, age, location, phoneNumber, accessibilityNeeds, profilePhoto } = req.body;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (age !== undefined) updateData.age = age;
      if (location) updateData.location = location;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
      if (accessibilityNeeds !== undefined) updateData.accessibilityNeeds = accessibilityNeeds;
      if (profilePhoto) updateData.profilePhoto = profilePhoto;

      const updated = await UserAccount.updatePINProfile(userId, updateData);

      res.json({
        message: 'Profile updated successfully',
        profile: {
          id: updated.id,
          name: updated.name,
          age: updated.age,
          location: updated.location,
          phoneNumber: updated.phoneNumber,
          accessibilityNeeds: updated.accessibilityNeeds,
          profilePhoto: updated.profilePhoto,
          status: updated.profileStatus,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
