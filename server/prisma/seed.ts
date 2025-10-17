import { PrismaClient, UserType, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  
  // Hash password once (all test accounts use 'password123')
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. ADMIN USER
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      userType: UserType.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log('✅ Admin user created');

  // 2. PIN USER (Person in Need)
  const pinUser = await prisma.user.upsert({
    where: { email: 'pin@test.com' },
    update: {},
    create: {
      email: 'pin@test.com',
      password: hashedPassword,
      userType: UserType.PIN,
      status: UserStatus.ACTIVE,
      pin: {
        create: {
          name: 'John Doe',
          age: 65,
          location: 'Sydney, NSW',
          phoneNumber: '+61 400 000 001',
          accessibilityNeeds: 'Wheelchair accessible',
        },
      },
    },
  });
  console.log('✅ PIN user created');

  // 3. CSR REP USER
  const csrRepUser = await prisma.user.upsert({
    where: { email: 'csrrep@test.com' },
    update: {},
    create: {
      email: 'csrrep@test.com',
      password: hashedPassword,
      userType: UserType.CSR_REP,
      status: UserStatus.ACTIVE,
      csrRep: {
        create: {
          companyName: 'Test Corp Pty Ltd',
          companyRegistrationNumber: 'ACN123456789',
          industry: 'Technology',
          contactPerson: 'Jane Smith',
          phoneNumber: '+61 400 000 002',
          companyAddress: '123 Business St, Sydney NSW 2000',
        },
      },
    },
  });
  console.log('✅ CSR Rep user created');

  // 4. PLATFORM MANAGER USER
  const pmUser = await prisma.user.upsert({
    where: { email: 'pm@test.com' },
    update: {},
    create: {
      email: 'pm@test.com',
      password: hashedPassword,
      userType: UserType.PLATFORM_MANAGER,
      status: UserStatus.ACTIVE,
      platformManager: {
        create: {
          fullName: 'Sarah Johnson',
          department: 'Platform Operations',
          phone: '+61 400 000 003',
        },
      },
    },
  });
  console.log('✅ Platform Manager user created');

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

