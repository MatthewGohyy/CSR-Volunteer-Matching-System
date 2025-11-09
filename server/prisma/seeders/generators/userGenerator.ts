import { faker } from '@faker-js/faker';
import { PrismaClient, UserStatus, ProfileStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { industries } from '../data/industries';
import { getRandomLocation, accessibilityNeeds } from '../data/locations';

/**
 * User Account Generator
 * Generates realistic user accounts for all four user types
 */

const prisma = new PrismaClient();

// Helper to get random item from array
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper to get random phone number (Australian format)
function generateAustralianPhone(): string {
  const mobilePrefix = faker.number.int({ min: 400, max: 499 });
  const middlePart = faker.number.int({ min: 100, max: 999 });
  const lastPart = faker.number.int({ min: 100, max: 999 });
  return `+61 ${mobilePrefix} ${middlePart} ${lastPart}`;
}

/**
 * Generate User Administrator accounts
 */
export async function generateAdminUsers(count: number, profileId: string): Promise<void> {
  console.log(`📊 Generating ${count} User Administrator accounts...`);
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    await prisma.userAccount.create({
      data: {
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        phoneNumber: generateAustralianPhone(),
        address: faker.location.streetAddress() + ', ' + getRandomLocation(),
        userProfileId: profileId,
        status: UserStatus.ACTIVE,
        profileStatus: ProfileStatus.ACTIVE,
      },
    });
  }
  
  console.log(`✅ Generated ${count} User Administrators`);
}

/**
 * Generate Person in Need (PIN) accounts
 */
export async function generatePINUsers(count: number, profileId: string): Promise<void> {
  console.log(`📊 Generating ${count} Person in Need accounts...`);
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const age = faker.number.int({ min: 18, max: 85 });
    const location = getRandomLocation();
    
    // Some users have accessibility needs, some don't
    const needsSupport = Math.random() > 0.4; // 60% have some needs
    
    await prisma.userAccount.create({
      data: {
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        phoneNumber: generateAustralianPhone(),
        address: faker.location.streetAddress() + ', ' + location,
        dateOfBirth: faker.date.birthdate({ min: 18, max: 85, mode: 'age' }),
        userProfileId: profileId,
        status: UserStatus.ACTIVE,
        profileStatus: ProfileStatus.ACTIVE,
        // PIN-specific fields
        age: age,
        location: location,
        accessibilityNeeds: needsSupport ? randomChoice(accessibilityNeeds) : 'None',
        profilePhoto: null, // Can be added later if needed
      },
    });
  }
  
  console.log(`✅ Generated ${count} PIN users`);
}

/**
 * Generate CSR Representative accounts
 */
export async function generateCSRRepUsers(count: number, profileId: string): Promise<void> {
  console.log(`📊 Generating ${count} CSR Representative accounts...`);
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const companyName = faker.company.name();
    const location = getRandomLocation();
    
    await prisma.userAccount.create({
      data: {
        email: faker.internet.email({ firstName, lastName, provider: companyName.toLowerCase().replace(/[^a-z]/g, '') + '.com' }).toLowerCase(),
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        phoneNumber: generateAustralianPhone(),
        address: faker.location.streetAddress() + ', ' + location,
        userProfileId: profileId,
        status: UserStatus.ACTIVE,
        profileStatus: ProfileStatus.ACTIVE,
        // CSR Rep-specific fields
        companyName: companyName + ' Pty Ltd',
        companyRegistrationNumber: 'ACN' + faker.string.numeric(9),
        industry: randomChoice(industries),
        contactPerson: `${firstName} ${lastName}`,
        companyAddress: faker.location.streetAddress() + ', ' + location,
        companyLogo: null, // Can be added later if needed
      },
    });
  }
  
  console.log(`✅ Generated ${count} CSR Representative users`);
}

/**
 * Generate Platform Manager accounts
 */
export async function generatePlatformManagerUsers(count: number, profileId: string): Promise<void> {
  console.log(`📊 Generating ${count} Platform Manager accounts...`);
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const departments = [
    'Platform Operations',
    'User Experience',
    'Category Management',
    'Data Analytics',
    'Quality Assurance'
  ];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    await prisma.userAccount.create({
      data: {
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        phoneNumber: generateAustralianPhone(),
        address: faker.location.streetAddress() + ', ' + getRandomLocation(),
        userProfileId: profileId,
        status: UserStatus.ACTIVE,
        profileStatus: ProfileStatus.ACTIVE,
        // Platform Manager-specific fields
        department: randomChoice(departments),
      },
    });
  }
  
  console.log(`✅ Generated ${count} Platform Manager users`);
}

/**
 * Get all users by profile type
 */
export async function getUsersByProfile(profileName: string) {
  return await prisma.userAccount.findMany({
    where: {
      userProfile: {
        name: profileName
      },
      status: UserStatus.ACTIVE
    }
  });
}

