import { PrismaClient, UserStatus, ProfileStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  
  // Hash password once (all test accounts use 'password123')
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. CREATE USER PROFILES - name is now the unique identifier
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
  console.log('✅ User profiles created (4 roles)');

  // Get the profile IDs for reference
  const adminProfile = userProfiles[0]; // USER_ADMIN
  const pinProfile = userProfiles[1]; // PIN
  const csrRepProfile = userProfiles[2]; // CSR_REP
  const pmProfile = userProfiles[3]; // PLATFORM_MANAGER

  // 2. ADMIN USER ACCOUNT
  const adminUser = await prisma.userAccount.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Admin User',
      userProfileId: adminProfile.id,
      status: UserStatus.ACTIVE,
    },
  });
  console.log('✅ Admin user account created');

  // 3. PIN USER ACCOUNT (Person in Need)
  const pinUser = await prisma.userAccount.upsert({
    where: { email: 'pin@test.com' },
    update: {
      status: UserStatus.ACTIVE,
      profileStatus: ProfileStatus.ACTIVE,
    },
    create: {
      email: 'pin@test.com',
      password: hashedPassword,
      name: 'John Doe',
      phoneNumber: '+61 400 000 001',
      address: 'Sydney, NSW',
      userProfileId: pinProfile.id,
      status: UserStatus.ACTIVE,
      // PIN-specific fields
      age: 65,
      location: 'Sydney, NSW',
      accessibilityNeeds: 'Wheelchair accessible',
    },
  });
  console.log('✅ PIN user account created');

  // 4. CSR REP USER ACCOUNT
  const csrRepUser = await prisma.userAccount.upsert({
    where: { email: 'csrrep@test.com' },
    update: {},
    create: {
      email: 'csrrep@test.com',
      password: hashedPassword,
      name: 'Jane Smith',
      phoneNumber: '+61 400 000 002',
      address: '123 Business St, Sydney NSW 2000',
      userProfileId: csrRepProfile.id,
      status: UserStatus.ACTIVE,
      // CSR Rep-specific fields
      companyName: 'Test Corp Pty Ltd',
      companyRegistrationNumber: 'ACN123456789',
      industry: 'Technology',
      contactPerson: 'Jane Smith',
      companyAddress: '123 Business St, Sydney NSW 2000',
    },
  });
  console.log('✅ CSR Rep user account created');

  // 5. PLATFORM MANAGER USER ACCOUNT
  const pmUser = await prisma.userAccount.upsert({
    where: { email: 'pm@test.com' },
    update: {},
    create: {
      email: 'pm@test.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      phoneNumber: '+61 400 000 003',
      userProfileId: pmProfile.id,
      status: UserStatus.ACTIVE,
      // Platform Manager-specific fields
      department: 'Platform Operations',
    },
  });
  console.log('✅ Platform Manager user account created');

  // 5. SERVICE CATEGORIES
  const categories = [
    { name: 'Medical', description: 'Medical appointments, healthcare support' },
    { name: 'Transportation', description: 'Rides to appointments, errands' },
    { name: 'Companionship', description: 'Social visits, conversation' },
    { name: 'Home Care', description: 'Light housework, meal preparation' },
    { name: 'Errands', description: 'Grocery shopping, picking up items' },
    { name: 'Technology', description: 'Help with devices, online services' },
    { name: 'Other', description: 'Other types of assistance' },
  ];

  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Service categories created');

  console.log('\n🎉 Seed complete! Test accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:            admin@test.com / password123');
  console.log('PIN:              pin@test.com / password123');
  console.log('CSR Rep:          csrrep@test.com / password123');
  console.log('Platform Manager: pm@test.com / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

