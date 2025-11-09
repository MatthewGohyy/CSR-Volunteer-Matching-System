import { PrismaClient, UserStatus, ProfileStatus, RequestStatus, OfferStatus, MatchStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { requestCategories } from './data/categories';
import {
  generateAdminUsers,
  generatePINUsers,
  generateCSRRepUsers,
  generatePlatformManagerUsers,
  getUsersByProfile
} from './generators/userGenerator';
import { generateRequests, getActiveRequests, getRequestsByStatus } from './generators/requestGenerator';
import { generateShortlists } from './generators/shortlistGenerator';
import { generateVolunteerOffers, getOffersByStatus } from './generators/offerGenerator';
import { generateMatches, getAllMatches } from './generators/matchGenerator';
import { generateNotifications, generateRequestUpdateNotifications } from './generators/notificationGenerator';

const prisma = new PrismaClient();

/**
 * COMPREHENSIVE TEST DATA GENERATOR
 * 
 * This script generates a complete dataset for demo and testing:
 * - 100 User Accounts (distributed across 4 user types)
 * - 20 Request Categories
 * - 120 Requests (various statuses)
 * - 150+ Shortlists
 * - 100+ Volunteer Offers (various statuses)
 * - 60+ Matches (various statuses)
 * - 200+ Notifications
 * 
 * Execution order is critical to maintain referential integrity!
 */

async function main() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   🌱 LARGE DATASET GENERATOR FOR CSR MATCHING SYSTEM     ║');
  console.log('║   Generating 100+ user accounts and related data         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  
  const startTime = Date.now();
  
  try {
    // ============================================================================
    // PHASE 1: USER PROFILES (Foundation - 4 role types)
    // ============================================================================
    console.log('📋 PHASE 1: Creating User Profiles (Role Types)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const userProfiles = await Promise.all([
      prisma.userProfile.upsert({
        where: { name: 'User Administrator' },
        update: {},
        create: {
          name: 'User Administrator',
          description: 'Manages user accounts and profiles',
          permissions: { manageUsers: true, manageProfiles: true },
          isActive: true,
        },
      }),
      prisma.userProfile.upsert({
        where: { name: 'Person in Need' },
        update: {},
        create: {
          name: 'Person in Need',
          description: 'Recipient of volunteer assistance',
          permissions: { createRequests: true, viewMatches: true },
          isActive: true,
        },
      }),
      prisma.userProfile.upsert({
        where: { name: 'CSR Representative' },
        update: {},
        create: {
          name: 'CSR Representative',
          description: 'Corporate volunteer representative',
          permissions: { shortlistRequests: true, submitOffers: true },
          isActive: true,
        },
      }),
      prisma.userProfile.upsert({
        where: { name: 'Platform Manager' },
        update: {},
        create: {
          name: 'Platform Manager',
          description: 'Manages platform categories and reports',
          permissions: { manageCategories: true, viewReports: true },
          isActive: true,
        },
      }),
    ]);
    
    console.log('✅ Created 4 user profiles (role types)\n');
    
    // ============================================================================
    // PHASE 2: USER ACCOUNTS (100 users distributed across roles)
    // ============================================================================
    console.log('👥 PHASE 2: Creating User Accounts (100 users)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const [adminProfile, pinProfile, csrRepProfile, pmProfile] = userProfiles;
    
    // Create 5 Admin users
    await generateAdminUsers(5, adminProfile.id);
    
    // Create 40 PIN users
    await generatePINUsers(40, pinProfile.id);
    
    // Create 50 CSR Rep users
    await generateCSRRepUsers(50, csrRepProfile.id);
    
    // Create 5 Platform Manager users
    await generatePlatformManagerUsers(5, pmProfile.id);
    
    const totalUsers = await prisma.userAccount.count();
    console.log(`✅ Total users created: ${totalUsers}\n`);
    
    // ============================================================================
    // PHASE 3: REQUEST CATEGORIES (20 categories)
    // ============================================================================
    console.log('📂 PHASE 3: Creating Request Categories (20 categories)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    for (const category of requestCategories) {
      await prisma.requestCategory.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    }
    
    const categories = await prisma.requestCategory.findMany();
    console.log(`✅ Created ${categories.length} categories\n`);
    
    // ============================================================================
    // PHASE 4: REQUESTS (120 requests with various statuses)
    // ============================================================================
    console.log('📝 PHASE 4: Creating Requests (120 requests)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const pinUsers = await getUsersByProfile('Person in Need');
    
    await generateRequests(
      pinUsers,
      categories,
      [
        { status: RequestStatus.ACTIVE, count: 50 },
        { status: RequestStatus.MATCHED, count: 40 },
        { status: RequestStatus.COMPLETED, count: 25 },
        { status: RequestStatus.CANCELLED, count: 5 }
      ]
    );
    
    const totalRequests = await prisma.request.count();
    console.log(`✅ Total requests created: ${totalRequests}\n`);
    
    // ============================================================================
    // PHASE 5: SHORTLISTS (150+ entries)
    // ============================================================================
    console.log('⭐ PHASE 5: Creating Shortlists (150+ entries)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const csrRepUsers = await getUsersByProfile('CSR Representative');
    const activeRequests = await getActiveRequests();
    
    await generateShortlists(csrRepUsers, activeRequests);
    
    const totalShortlists = await prisma.shortlist.count();
    console.log(`✅ Total shortlists created: ${totalShortlists}\n`);
    
    // ============================================================================
    // PHASE 6: VOLUNTEER OFFERS (100+ offers)
    // ============================================================================
    console.log('🤝 PHASE 6: Creating Volunteer Offers (100+ offers)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const allOffers = await generateVolunteerOffers(
      csrRepUsers,
      activeRequests,
      [
        { status: OfferStatus.PENDING, count: 30 },
        { status: OfferStatus.ACCEPTED, count: 40 },
        { status: OfferStatus.DECLINED, count: 30 }
      ]
    );
    
    const totalOffers = await prisma.volunteerOffer.count();
    console.log(`✅ Total offers created: ${totalOffers}\n`);
    
    // ============================================================================
    // PHASE 7: MATCHES (60+ matches)
    // ============================================================================
    console.log('🔗 PHASE 7: Creating Matches (60+ matches)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const acceptedOffers = await getOffersByStatus(OfferStatus.ACCEPTED);
    
    await generateMatches(
      acceptedOffers,
      [
        { status: MatchStatus.ACTIVE, count: 30 },
        { status: MatchStatus.COMPLETED, count: 25 },
        { status: MatchStatus.CANCELLED, count: 5 }
      ]
    );
    
    const totalMatches = await prisma.match.count();
    console.log(`✅ Total matches created: ${totalMatches}\n`);
    
    // ============================================================================
    // PHASE 8: NOTIFICATIONS (200+ notifications)
    // ============================================================================
    console.log('🔔 PHASE 8: Creating Notifications (200+ notifications)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const allMatches = await getAllMatches();
    
    // Generate notifications based on offers and matches
    await generateNotifications(allOffers, allMatches);
    
    // Generate additional request update notifications
    await generateRequestUpdateNotifications(pinUsers);
    
    const totalNotifications = await prisma.notification.count();
    console.log(`✅ Total notifications created: ${totalNotifications}\n`);
    
    // ============================================================================
    // FINAL SUMMARY
    // ============================================================================
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                   🎉 GENERATION COMPLETE!                 ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('📊 FINAL DATA SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   User Profiles:        4`);
    console.log(`   User Accounts:        ${totalUsers}`);
    console.log(`     ├─ Admins:          5`);
    console.log(`     ├─ PINs:            40`);
    console.log(`     ├─ CSR Reps:        50`);
    console.log(`     └─ Platform Mgrs:   5`);
    console.log(`   Request Categories:   ${categories.length}`);
    console.log(`   Requests:             ${totalRequests}`);
    console.log(`   Shortlists:           ${totalShortlists}`);
    console.log(`   Volunteer Offers:     ${totalOffers}`);
    console.log(`   Matches:              ${totalMatches}`);
    console.log(`   Notifications:        ${totalNotifications}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ⏱️  Generation time:    ${duration}s`);
    console.log('');
    console.log('🔐 All test users have password: password123');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error during data generation:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

