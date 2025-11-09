import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to get random item from array
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate Shortlists
 * Each CSR Rep shortlists 3-5 random ACTIVE requests
 */
export async function generateShortlists(
  csrRepUsers: any[],
  activeRequests: any[]
): Promise<void> {
  console.log(`📊 Generating shortlists...`);
  
  let totalCreated = 0;
  
  for (const csrRep of csrRepUsers) {
    // Each CSR Rep shortlists 3-5 requests
    const numToShortlist = faker.number.int({ min: 3, max: 5 });
    
    // Get random unique requests for this CSR Rep
    const shuffledRequests = shuffleArray(activeRequests);
    const requestsToShortlist = shuffledRequests.slice(0, numToShortlist);
    
    for (const request of requestsToShortlist) {
      try {
        // Check if shortlist already exists
        const existing = await prisma.shortlist.findUnique({
          where: {
            csrRepId_requestId: {
              csrRepId: csrRep.id,
              requestId: request.id
            }
          }
        });
        
        if (!existing) {
          await prisma.shortlist.create({
            data: {
              csrRepId: csrRep.id,
              requestId: request.id,
              createdAt: faker.date.recent({ days: 20 })
            },
          });
          
          // Update the request's shortlist count
          await prisma.request.update({
            where: { id: request.id },
            data: {
              shortlistCount: {
                increment: 1
              }
            }
          });
          
          totalCreated++;
        }
      } catch (error) {
        // Skip if duplicate (shouldn't happen with unique check)
        console.log(`  Skipping duplicate shortlist`);
      }
    }
  }
  
  console.log(`✅ Generated ${totalCreated} shortlist entries`);
}

/**
 * Get shortlists by CSR Rep
 */
export async function getShortlistsByCSRRep(csrRepId: string) {
  return await prisma.shortlist.findMany({
    where: { csrRepId: csrRepId },
    include: {
      request: {
        include: {
          pin: true,
          category: true
        }
      }
    }
  });
}

