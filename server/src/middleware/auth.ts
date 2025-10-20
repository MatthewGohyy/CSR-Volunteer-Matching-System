import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserType, UserStatus } from '@prisma/client';
import { UserEntity } from '../entities/User.entity';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    userType: UserType;
  };
}

/**
 * Authenticate middleware - Verifies JWT token and checks if user account is active
 * This checks the USER ACCOUNT status (not profile status)
 * Suspended accounts cannot login at all
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      userType: UserType;
    };

    // Check if user account exists and is active
    const user = await UserEntity.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ error: 'User account not found' });
      return;
    }

    if (user.status === UserStatus.SUSPENDED) {
      res.status(403).json({ 
        error: 'Account suspended', 
        message: 'Your account has been suspended. Please contact support.' 
      });
      return;
    }

    if (user.status === UserStatus.DEACTIVATED) {
      res.status(403).json({ 
        error: 'Account deactivated', 
        message: 'Your account has been deactivated. Please contact support.' 
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Authorize middleware - Checks if user has the required role/permissions
 * This only checks the USER TYPE, not the profile status
 * For profile-specific actions, use requireActiveProfile middleware
 */
export const authorize = (...allowedRoles: UserType[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.userType)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

/**
 * Require Active Profile middleware - Checks if user's profile is active
 * This is for role-specific actions (e.g., creating requests, viewing shortlists)
 * A suspended profile means the user can login but cannot perform these actions
 */
export const requireActiveProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await UserEntity.findById(req.user.userId);
    
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Check profile status based on user type
    const profile = user.getProfile();
    
    if (!profile) {
      res.status(403).json({ 
        error: 'Profile not found',
        message: 'Your user profile is not set up. Please contact support.' 
      });
      return;
    }

    // Check if profile has a status field (it should after migration)
    if ('status' in profile && profile.status !== 'ACTIVE') {
      res.status(403).json({ 
        error: 'Profile suspended',
        message: 'Your profile has been suspended. You can login but cannot perform role-specific actions. Please contact support.' 
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error checking profile status' });
  }
};

