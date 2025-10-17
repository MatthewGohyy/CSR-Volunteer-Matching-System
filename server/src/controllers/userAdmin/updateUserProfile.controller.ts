import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../../entities/User.entity';
import { PINEntity } from '../../entities/PIN.entity';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
import { AppError } from '../../middleware/errorHandler';
import { UserType } from '@prisma/client';
import { prisma } from '../../config/database';

/**
 * Update User Profile Controller
 * 
 * Story #10: As a User Admin, I want to update a user profile so that the latest information is shown.
 */
export class UpdateUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const profileData = req.body;


      const user = await UserEntity.findById(id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      let updatedProfile;

      // Update based on user type
      if (user.userType === UserType.PIN && user.pin) {
        const { name, age, location, phoneNumber, accessibilityNeeds, profilePhoto } = profileData;
        
        const updateData: any = {};
        if (name) updateData.name = name;
        if (age !== undefined) updateData.age = parseInt(age);
        if (location) updateData.location = location;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (accessibilityNeeds !== undefined) updateData.accessibilityNeeds = accessibilityNeeds;
        if (profilePhoto) updateData.profilePhoto = profilePhoto;
        
        updatedProfile = await PINEntity.updateByUserId(id, updateData);
      } else if (user.userType === UserType.CSR_REP && user.csrRep) {
        const { companyName, industry, contactPerson, phoneNumber, companyAddress, companyLogo } = profileData;
        
        const updateData: any = {};
        if (companyName) updateData.companyName = companyName;
        if (industry) updateData.industry = industry;
        if (contactPerson) updateData.contactPerson = contactPerson;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (companyAddress) updateData.companyAddress = companyAddress;
        if (companyLogo) updateData.companyLogo = companyLogo;
        
        updatedProfile = await CSRRepEntity.updateByUserId(id, updateData);
      } else if (user.userType === UserType.PLATFORM_MANAGER && user.platformManager) {
        const { fullName, department, phone } = profileData;
        
        updatedProfile = await prisma.platformManager.update({
          where: { id: user.platformManager.id },
          data: {
            ...(fullName && { fullName }),
            ...(department && { department }),
            ...(phone && { phone }),
          },
        });
      } else {
        throw new AppError('User profile not found', 404);
      }

      res.json({
        message: 'Profile updated successfully',
        profile: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}

