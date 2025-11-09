/**
 * Test Data Helpers
 * Provides reusable test data for consistent testing
 */

export const testUsers = {
  admin: {
    email: 'test-admin@test.com',
    password: 'TestAdmin123',
    name: 'Test Admin User',
  },
  pin: {
    email: 'test-pin@test.com',
    password: 'TestPIN123',
    name: 'Test PIN User',
    age: 65,
    location: 'Sydney, NSW',
    phoneNumber: '+61 400 000 001',
    accessibilityNeeds: 'Wheelchair accessible',
  },
  csrRep: {
    email: 'test-csr@test.com',
    password: 'TestCSR123',
    name: 'Test CSR Rep',
    companyName: 'Test Company Pty Ltd',
    companyRegistrationNumber: 'ACN999999999',
    industry: 'Technology',
    contactPerson: 'Test Contact',
    phoneNumber: '+61 400 000 002',
    companyAddress: '123 Test St, Sydney NSW 2000',
  },
  platformManager: {
    email: 'test-pm@test.com',
    password: 'TestPM123',
    name: 'Test Platform Manager',
    phoneNumber: '+61 400 000 003',
    department: 'Platform Operations',
  },
};

export const invalidCredentials = {
  email: 'nonexistent@test.com',
  password: 'WrongPassword123',
};

export const testProfile = {
  name: 'Test Profile',
  description: 'Test profile for testing',
  permissions: { test: true },
};

