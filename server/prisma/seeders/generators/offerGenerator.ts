import { faker } from '@faker-js/faker';
import { PrismaClient, OfferStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to get random item from array
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate Volunteer Offers
 * CSR Reps submit offers for ACTIVE requests
 * Distribution: 25 PENDING (8.3%), 250 ACCEPTED (83.3%), 25 DECLINED (8.3%)
 * Total: 300 offers
 */
export async function generateVolunteerOffers(
  csrRepUsers: any[],
  activeRequests: any[],
  offerDistribution: { status: OfferStatus; count: number }[]
): Promise<any[]> {
  console.log(`📊 Generating volunteer offers...`);
  
  const allOffers: any[] = [];
  let totalCreated = 0;
  
  // Track which requests have been used to avoid duplicates
  const usedRequestIds = new Set<string>();
  
  for (const { status, count } of offerDistribution) {
    console.log(`  Creating ${count} offers with status: ${status}`);
    
    for (let i = 0; i < count; i++) {
      // Pick a random CSR Rep
      const csrRep = randomChoice(csrRepUsers);
      
      // Pick a random request that hasn't been used yet
      let request;
      let attempts = 0;
      do {
        request = randomChoice(activeRequests);
        attempts++;
      } while (usedRequestIds.has(`${csrRep.id}-${request.id}`) && attempts < 50);
      
      if (attempts >= 50) {
        console.log(`  Warning: Could not find unique request after 50 attempts`);
        continue;
      }
      
      usedRequestIds.add(`${csrRep.id}-${request.id}`);
      
      // Generate realistic offer message
      const message = generateOfferMessage(request.category.name, csrRep.companyName);
      
      // Generate timestamps based on status
      const createdAt = faker.date.recent({ days: 25 });
      const updatedAt = status !== OfferStatus.PENDING 
        ? faker.date.between({ from: createdAt, to: new Date() })
        : createdAt;
      
      const offer = await prisma.volunteerOffer.create({
        data: {
          csrRepId: csrRep.id,
          requestId: request.id,
          message: message,
          status: status,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
        include: {
          csrRep: true,
          request: {
            include: {
              pin: true,
              category: true
            }
          }
        }
      });
      
      allOffers.push(offer);
      totalCreated++;
    }
  }
  
  console.log(`✅ Generated ${totalCreated} volunteer offers`);
  return allOffers;
}

/**
 * Generate realistic offer message based on category
 */
function generateOfferMessage(categoryName: string, companyName: string): string {
  const messages: Record<string, string[]> = {
    'Medical Appointments': [
      `Hello! Our team at ${companyName} would be happy to provide transportation support for your medical appointments. We have volunteers available on weekdays and can accommodate your schedule.`,
      `Hi there! We understand the importance of getting to medical appointments. ${companyName} can provide reliable transport and a friendly companion for your appointments.`,
      `Greetings! ${companyName} has experienced volunteers who can help with transportation to your medical appointments. We're happy to discuss your specific needs.`
    ],
    'Transportation': [
      `Hello! ${companyName} offers transportation services through our volunteer program. We'd be pleased to assist with your transportation needs.`,
      `Hi! Our volunteers at ${companyName} are ready to help with transportation. We can provide regular or one-off rides as needed.`,
      `Good day! ${companyName} would like to support you with reliable transportation. Our volunteers are background-checked and experienced.`
    ],
    'Companionship': [
      `Hello! ${companyName} has friendly volunteers who would love to provide companionship. We believe in building meaningful connections in our community.`,
      `Hi there! Our team at ${companyName} includes wonderful volunteers interested in providing regular companionship and social support.`,
      `Greetings! ${companyName} would be honored to match you with a companion volunteer. We can arrange regular visits that suit your schedule.`
    ],
    'Grocery Shopping': [
      `Hello! ${companyName} volunteers are available to assist with grocery shopping. We can help with weekly or bi-weekly shopping trips.`,
      `Hi! Our team at ${companyName} is happy to provide shopping assistance. We can help you get the items you need safely and conveniently.`,
      `Good day! ${companyName} offers grocery shopping support through our volunteer program. We're experienced in assisting with shopping needs.`
    ],
    'Technology Support': [
      `Hello! ${companyName} has tech-savvy volunteers who love helping people learn new technology. We offer patient, step-by-step guidance.`,
      `Hi there! Our volunteers at ${companyName} specialize in technology support. We can help you become comfortable with your devices.`,
      `Greetings! ${companyName} provides friendly technology assistance. We're experienced in teaching people of all ages to use technology.`
    ]
  };
  
  const categoryMessages = messages[categoryName] || [
    `Hello! ${companyName} would be delighted to assist you with this request. Our volunteers are experienced and committed to helping our community.`,
    `Hi there! Our team at ${companyName} is interested in supporting you. We have dedicated volunteers ready to help with your needs.`,
    `Greetings! ${companyName} believes in giving back to the community. We would be happy to provide the assistance you're seeking.`
  ];
  
  return randomChoice(categoryMessages);
}

/**
 * Get offers by status
 */
export async function getOffersByStatus(status: OfferStatus) {
  return await prisma.volunteerOffer.findMany({
    where: { status: status },
    include: {
      csrRep: true,
      request: {
        include: {
          pin: true,
          category: true
        }
      }
    }
  });
}

