import { faker } from '@faker-js/faker';
import { PrismaClient, NotificationType, OfferStatus, MatchStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate Notifications based on system activities
 * Creates notifications for PINs and CSR Reps based on offers, matches, etc.
 */
export async function generateNotifications(
  allOffers: any[],
  allMatches: any[]
): Promise<void> {
  console.log(`📊 Generating notifications...`);
  
  let totalCreated = 0;
  
  // 1. Generate notifications for volunteer offers (PIN receives notification)
  for (const offer of allOffers) {
    const message = `${offer.csrRep.companyName} has submitted a volunteer offer for your request: "${offer.request.title}"`;
    
    await prisma.notification.create({
      data: {
        userId: offer.request.pinId,
        type: NotificationType.VOLUNTEER_OFFER,
        message: message,
        isRead: Math.random() > 0.4, // 60% are read
        createdAt: faker.date.between({ 
          from: offer.createdAt, 
          to: new Date() 
        })
      }
    });
    
    totalCreated++;
    
    // 2. If offer is ACCEPTED, create acceptance notification for CSR Rep
    if (offer.status === OfferStatus.ACCEPTED) {
      const acceptMessage = `Your volunteer offer for "${offer.request.title}" has been accepted by ${offer.request.pin.name}`;
      
      await prisma.notification.create({
        data: {
          userId: offer.csrRepId,
          type: NotificationType.OFFER_ACCEPTED,
          message: acceptMessage,
          isRead: Math.random() > 0.3, // 70% are read
          createdAt: faker.date.between({ 
            from: offer.updatedAt, 
            to: new Date() 
          })
        }
      });
      
      totalCreated++;
    }
    
    // 3. If offer is DECLINED, create decline notification for CSR Rep
    if (offer.status === OfferStatus.DECLINED) {
      const declineMessage = `Your volunteer offer for "${offer.request.title}" has been declined`;
      
      await prisma.notification.create({
        data: {
          userId: offer.csrRepId,
          type: NotificationType.OFFER_DECLINED,
          message: declineMessage,
          isRead: Math.random() > 0.5, // 50% are read
          createdAt: faker.date.between({ 
            from: offer.updatedAt, 
            to: new Date() 
          })
        }
      });
      
      totalCreated++;
    }
  }
  
  // 4. Generate notifications for matches
  for (const match of allMatches) {
    // Match confirmed notification for both parties
    const pinMatchMessage = `You have been matched with ${match.csrRep.companyName} for your request: "${match.request.title}"`;
    const csrMatchMessage = `You have been matched with ${match.pin.name} for the request: "${match.request.title}"`;
    
    // Notification for PIN
    await prisma.notification.create({
      data: {
        userId: match.pinId,
        type: NotificationType.MATCH_CONFIRMED,
        message: pinMatchMessage,
        isRead: Math.random() > 0.2, // 80% are read
        createdAt: faker.date.between({ 
          from: match.matchedAt, 
          to: new Date() 
        })
      }
    });
    
    totalCreated++;
    
    // Notification for CSR Rep
    await prisma.notification.create({
      data: {
        userId: match.csrRepId,
        type: NotificationType.MATCH_CONFIRMED,
        message: csrMatchMessage,
        isRead: Math.random() > 0.2, // 80% are read
        createdAt: faker.date.between({ 
          from: match.matchedAt, 
          to: new Date() 
        })
      }
    });
    
    totalCreated++;
    
    // 5. If match is CANCELLED, create cancellation notifications
    if (match.status === MatchStatus.CANCELLED && match.completedAt) {
      const pinCancelMessage = `Your match with ${match.csrRep.companyName} has been cancelled. Reason: ${match.cancellationReason}`;
      const csrCancelMessage = `Your match with ${match.pin.name} has been cancelled. Reason: ${match.cancellationReason}`;
      
      // Notification for PIN
      await prisma.notification.create({
        data: {
          userId: match.pinId,
          type: NotificationType.MATCH_CANCELLED,
          message: pinCancelMessage,
          isRead: Math.random() > 0.3, // 70% are read
          createdAt: faker.date.between({ 
            from: match.completedAt, 
            to: new Date() 
          })
        }
      });
      
      totalCreated++;
      
      // Notification for CSR Rep
      await prisma.notification.create({
        data: {
          userId: match.csrRepId,
          type: NotificationType.MATCH_CANCELLED,
          message: csrCancelMessage,
          isRead: Math.random() > 0.3, // 70% are read
          createdAt: faker.date.between({ 
            from: match.completedAt, 
            to: new Date() 
          })
        }
      });
      
      totalCreated++;
    }
  }
  
  console.log(`✅ Generated ${totalCreated} notifications`);
}

/**
 * Generate additional request update notifications for PINs
 */
export async function generateRequestUpdateNotifications(
  pinUsers: any[]
): Promise<void> {
  console.log(`📊 Generating additional request update notifications...`);
  
  let totalCreated = 0;
  
  // Generate some random request update notifications
  for (let i = 0; i < 50; i++) {
    const pin = pinUsers[Math.floor(Math.random() * pinUsers.length)];
    
    const updateMessages = [
      'Your request has received new views from CSR Representatives',
      'Your request has been shortlisted by a volunteer organization',
      'Multiple organizations are viewing your request',
      'Your request is gaining attention from volunteers'
    ];
    
    const message = updateMessages[Math.floor(Math.random() * updateMessages.length)];
    
    await prisma.notification.create({
      data: {
        userId: pin.id,
        type: NotificationType.REQUEST_UPDATED,
        message: message,
        isRead: Math.random() > 0.5, // 50% are read
        createdAt: faker.date.recent({ days: 30 })
      }
    });
    
    totalCreated++;
  }
  
  console.log(`✅ Generated ${totalCreated} request update notifications`);
}

/**
 * Get notifications by user
 */
export async function getNotificationsByUser(userId: string) {
  return await prisma.notification.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' }
  });
}

