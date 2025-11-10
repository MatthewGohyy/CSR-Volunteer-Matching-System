import { faker } from '@faker-js/faker';
import { PrismaClient, MatchStatus, RequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate Matches from ACCEPTED offers
 * Creates matches with different statuses: ACTIVE, COMPLETED, CANCELLED
 */
export async function generateMatches(
  acceptedOffers: any[],
  matchDistribution: { status: MatchStatus; count: number }[]
): Promise<void> {
  console.log(`📊 Generating matches...`);
  
  // Get unique requests from accepted offers (one offer per request)
  const uniqueRequestOffers = new Map();
  for (const offer of acceptedOffers) {
    if (!uniqueRequestOffers.has(offer.requestId)) {
      uniqueRequestOffers.set(offer.requestId, offer);
    }
  }
  
  const uniqueOffers = Array.from(uniqueRequestOffers.values());
  console.log(`  Found ${uniqueOffers.length} unique requests with accepted offers`);
  
  // Shuffle for randomness
  for (let i = uniqueOffers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [uniqueOffers[i], uniqueOffers[j]] = [uniqueOffers[j], uniqueOffers[i]];
  }
  
  let totalCreated = 0;
  let offerIndex = 0;
  
  for (const { status, count } of matchDistribution) {
    console.log(`  Creating ${count} matches with status: ${status}`);
    
    for (let i = 0; i < count && offerIndex < uniqueOffers.length; i++) {
      const offer = uniqueOffers[offerIndex];
      offerIndex++;
      
      // Generate timestamps
      const matchedAt = faker.date.between({ 
        from: offer.createdAt, 
        to: new Date() 
      });
      
      const completedAt = (status === MatchStatus.COMPLETED || status === MatchStatus.CANCELLED)
        ? faker.date.between({ from: matchedAt, to: new Date() })
        : null;
      
      // Generate cancellation reason if cancelled
      const cancellationReason = status === MatchStatus.CANCELLED
        ? generateCancellationReason()
        : null;
      
      // Determine request status based on match status
      const requestStatus = status === MatchStatus.COMPLETED 
        ? RequestStatus.COMPLETED 
        : status === MatchStatus.CANCELLED 
        ? RequestStatus.CANCELLED 
        : RequestStatus.MATCHED;
      
      // Create the match
      await prisma.match.create({
        data: {
          requestId: offer.requestId,
          csrRepId: offer.csrRepId,
          pinId: offer.request.pinId,
          status: status,
          matchedAt: matchedAt,
          completedAt: completedAt,
          cancellationReason: cancellationReason,
          updatedAt: completedAt || matchedAt,
        },
      });
      
      // Update the request status
      await prisma.request.update({
        where: { id: offer.requestId },
        data: { 
          status: requestStatus,
          updatedAt: completedAt || matchedAt
        }
      });
      
      totalCreated++;
    }
  }
  
  console.log(`✅ Generated ${totalCreated} matches`);
}

/**
 * Generate realistic cancellation reasons
 */
function generateCancellationReason(): string {
  const reasons = [
    'Request no longer needed',
    'PIN found alternative assistance',
    'CSR Representative unable to continue',
    'Scheduling conflicts could not be resolved',
    'Request requirements changed',
    'Volunteer unavailable due to unforeseen circumstances',
    'Both parties agreed to cancel by mutual consent',
    'Request cancelled by PIN',
    'Service could not be provided as originally planned'
  ];
  
  return reasons[Math.floor(Math.random() * reasons.length)];
}

/**
 * Get matches by status
 */
export async function getMatchesByStatus(status: MatchStatus) {
  return await prisma.match.findMany({
    where: { status: status },
    include: {
      request: {
        include: {
          pin: true,
          category: true
        }
      },
      csrRep: true,
      pin: true
    }
  });
}

/**
 * Get all matches
 */
export async function getAllMatches() {
  return await prisma.match.findMany({
    include: {
      request: {
        include: {
          pin: true,
          category: true
        }
      },
      csrRep: true,
      pin: true
    }
  });
}

