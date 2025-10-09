import { PrismaClient, UserType, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@csr.com' },
    update: {},
    create: {
      email: 'admin@csr.com',
      password: hashedPassword,
      userType: UserType.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

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

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

