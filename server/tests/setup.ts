import { PrismaClient } from '@prisma/client';

// Global test setup
const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup and disconnect
  await prisma.$disconnect();
});

// Extend Jest matchers if needed
expect.extend({
  // Custom matchers can be added here
});

