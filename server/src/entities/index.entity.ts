/**
 * Entity Classes Export
 * 
 * Central export point for all entity classes.
 * Import entities like: import { UserEntity, RequestEntity } from '@/entities';
 */

export { UserEntity } from './User.entity';
export { RequestEntity } from './Request.entity';
export { PINEntity } from './PIN.entity';
export { CSRRepEntity } from './CSRRep.entity';
export { NotificationEntity } from './Notification.entity';
export { ServiceCategoryEntity } from './ServiceCategory.entity';
export { MatchEntity } from './Match.entity';
export { ShortlistEntity } from './Shortlist.entity';
export { VolunteerOfferEntity } from './VolunteerOffer.entity';

// Export Prisma types for convenience
export type {
  User,
  PIN,
  CSRRep,
  PlatformManager,
  Request,
  ServiceCategory,
  Shortlist,
  VolunteerOffer,
  Match,
  Notification,
  UserType,
  UserStatus,
  RequestStatus,
  UrgencyLevel,
  OfferStatus,
  MatchStatus,
  NotificationType,
} from '@prisma/client';
