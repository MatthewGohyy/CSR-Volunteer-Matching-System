import { faker } from '@faker-js/faker';
import { PrismaClient, RequestStatus, UrgencyLevel } from '@prisma/client';
import { requestTitlesByCategory, getRandomLocation } from '../data/locations';

const prisma = new PrismaClient();

// Helper to get random item from array
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate Requests for PINs
 * Creates a realistic distribution of requests across different statuses
 */
export async function generateRequests(
  pinUsers: any[],
  categories: any[],
  statusDistribution: { status: RequestStatus; count: number }[]
): Promise<void> {
  console.log(`📊 Generating requests...`);
  
  let totalCreated = 0;
  
  for (const { status, count } of statusDistribution) {
    console.log(`  Creating ${count} requests with status: ${status}`);
    
    for (let i = 0; i < count; i++) {
      // Pick a random PIN user
      const pin = randomChoice(pinUsers);
      
      // Pick a random category
      const category = randomChoice(categories);
      
      // Get appropriate title for category
      const possibleTitles = requestTitlesByCategory[category.name] || ['Help needed'];
      const title = randomChoice(possibleTitles);
      
      // Generate realistic description
      const description = generateDescription(category.name);
      
      // Generate urgency level (weighted towards MEDIUM)
      const urgency = generateUrgency();
      
      // Generate date needed (future dates for ACTIVE, past for COMPLETED/CANCELLED)
      const dateNeeded = generateDateNeeded(status);
      
      // Generate view and shortlist counts (higher for older requests)
      const viewCount = status === RequestStatus.ACTIVE 
        ? faker.number.int({ min: 5, max: 50 })
        : faker.number.int({ min: 10, max: 100 });
        
      const shortlistCount = status === RequestStatus.ACTIVE
        ? faker.number.int({ min: 0, max: 15 })
        : faker.number.int({ min: 2, max: 30 });
      
      await prisma.request.create({
        data: {
          pinId: pin.id,
          categoryId: category.id,
          title: title,
          description: description,
          urgency: urgency,
          dateNeeded: dateNeeded,
          location: pin.location || getRandomLocation(),
          status: status,
          viewCount: viewCount,
          shortlistCount: shortlistCount,
          createdAt: generateCreatedAt(status),
        },
      });
      
      totalCreated++;
    }
  }
  
  console.log(`✅ Generated ${totalCreated} requests`);
}

/**
 * Generate realistic description based on category
 */
function generateDescription(categoryName: string): string {
  const descriptions: Record<string, string[]> = {
    'Medical Appointments': [
      'I need assistance getting to my weekly doctor appointments. I have difficulty walking long distances and would appreciate help with transportation.',
      'Looking for someone to accompany me to my medical specialist. The appointment is scheduled for next week and I need reliable transport.',
      'Need help getting to and from my physiotherapy sessions. Would be great to have someone who can provide regular support.'
    ],
    'Transportation': [
      'Looking for regular transportation assistance to weekly community activities. I no longer drive and public transport is difficult.',
      'Need reliable transport to grocery shopping and errands. Would prefer someone who can assist 1-2 times per week.',
      'Seeking help with transportation to visit family members. Flexible with timing and happy to coordinate schedules.'
    ],
    'Companionship': [
      'Looking for friendly company for regular visits. I live alone and would enjoy conversation and social interaction.',
      'Seeking a companion for weekly tea and chat sessions. I enjoy talking about books, gardening, and current events.',
      'Would love to have someone visit regularly for companionship. I have many stories to share and enjoy meeting new people.'
    ],
    'Grocery Shopping': [
      'Need assistance with weekly grocery shopping. I have difficulty carrying bags and navigating the supermarket.',
      'Looking for help with grocery shopping once a week. Happy to provide a list and payment in advance.',
      'Seeking regular support for grocery shopping. Would appreciate someone who can help me shop for fresh produce and essentials.'
    ],
    'Technology Support': [
      'Need help setting up and learning to use my new smartphone. Struggling with apps and video calls.',
      'Looking for patient assistance with computer and internet. Want to learn how to use email and stay connected with family.',
      'Seeking help with technology to stay connected. Need support with video calling and online services.'
    ]
  };
  
  const categoryDescriptions = descriptions[categoryName] || [
    faker.lorem.sentences(3),
    faker.lorem.sentences(2) + ' ' + faker.lorem.sentence(),
    faker.lorem.sentences(4)
  ];
  
  return randomChoice(categoryDescriptions);
}

/**
 * Generate urgency level (weighted distribution)
 */
function generateUrgency(): UrgencyLevel {
  const rand = Math.random();
  if (rand < 0.15) return UrgencyLevel.HIGH;      // 15%
  if (rand < 0.60) return UrgencyLevel.MEDIUM;    // 45%
  return UrgencyLevel.LOW;                        // 40%
}

/**
 * Generate date needed based on request status
 */
function generateDateNeeded(status: RequestStatus): Date {
  const now = new Date();
  
  switch (status) {
    case RequestStatus.ACTIVE:
      // Future dates (1-90 days from now)
      return faker.date.future({ years: 0.25 });
      
    case RequestStatus.MATCHED:
      // Near future dates (1-30 days)
      return faker.date.soon({ days: 30 });
      
    case RequestStatus.COMPLETED:
      // Past dates (1-60 days ago)
      return faker.date.recent({ days: 60 });
      
    case RequestStatus.CANCELLED:
      // Past dates (1-30 days ago)
      return faker.date.recent({ days: 30 });
      
    default:
      return faker.date.future({ years: 0.25 });
  }
}

/**
 * Generate created at date based on status
 */
function generateCreatedAt(status: RequestStatus): Date {
  const now = new Date();
  
  switch (status) {
    case RequestStatus.ACTIVE:
      // Created 1-30 days ago
      return faker.date.recent({ days: 30 });
      
    case RequestStatus.MATCHED:
      // Created 15-45 days ago
      const matchedDate = new Date(now);
      matchedDate.setDate(matchedDate.getDate() - faker.number.int({ min: 15, max: 45 }));
      return matchedDate;
      
    case RequestStatus.COMPLETED:
      // Created 30-90 days ago
      const completedDate = new Date(now);
      completedDate.setDate(completedDate.getDate() - faker.number.int({ min: 30, max: 90 }));
      return completedDate;
      
    case RequestStatus.CANCELLED:
      // Created 7-45 days ago
      const cancelledDate = new Date(now);
      cancelledDate.setDate(cancelledDate.getDate() - faker.number.int({ min: 7, max: 45 }));
      return cancelledDate;
      
    default:
      return faker.date.recent({ days: 30 });
  }
}

/**
 * Get requests by status
 */
export async function getRequestsByStatus(status: RequestStatus) {
  return await prisma.request.findMany({
    where: { status: status },
    include: {
      pin: true,
      category: true
    }
  });
}

/**
 * Get all active requests
 */
export async function getActiveRequests() {
  return await prisma.request.findMany({
    where: { status: RequestStatus.ACTIVE },
    include: {
      pin: true,
      category: true
    }
  });
}

