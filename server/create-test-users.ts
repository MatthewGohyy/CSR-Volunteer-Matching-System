import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUsers() {
  console.log('🔧 Creating test users...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  try {
    // Create PIN user
    const pin = await prisma.user.upsert({
      where: { email: 'pin1@example.com' },
      update: {},
      create: {
        email: 'pin1@example.com',
        password: hashedPassword,
        userType: 'PIN',
        status: 'ACTIVE',
        pin: {
          create: {
            name: 'Test PIN User',
            age: 30,
            location: 'Sydney',
            phoneNumber: '0400000000',
          },
        },
      },
    });
    console.log('✅ Created PIN user');
    
    // Create CSR Rep user
    const csr = await prisma.user.upsert({
      where: { email: 'csr1@example.com' },
      update: {},
      create: {
        email: 'csr1@example.com',
        password: hashedPassword,
        userType: 'CSR_REP',
        status: 'ACTIVE',
        csrRep: {
          create: {
            companyName: 'Test Company',
            companyRegistrationNumber: 'TEST123',
            industry: 'Technology',
            contactPerson: 'John Doe',
            phoneNumber: '0400000001',
            companyAddress: '123 Test St, Sydney',
          },
        },
      },
    });
    console.log('✅ Created CSR Rep user');
    
    // Create Admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        userType: 'ADMIN',
        status: 'ACTIVE',
      },
    });
    console.log('✅ Created Admin user');
    
    console.log('🎉 Test users created successfully!');
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
