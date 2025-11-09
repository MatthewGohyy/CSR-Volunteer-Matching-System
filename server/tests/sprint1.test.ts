import request from 'supertest';
import { UserStatus, ProfileStatus } from '@prisma/client';
import { prisma } from '../src/config/database';
import { hashPassword } from '../src/utils/password';

const BASE_URL = 'http://localhost:4000';

/**
 * Sprint 1 Comprehensive Test Suite
 * 
 * Tests all 12 Sprint 1 user stories:
 * - Stories #1, #2: User Admin login/logout
 * - Stories #13, #14: PIN login/logout
 * - Stories #24, #25: CSR Rep login/logout
 * - Stories #33, #34: Platform Manager login/logout
 * - Story #3: Create user accounts
 * - Story #6: Suspend user account
 * - Story #8: Create user profiles
 * - Story #11: Suspend user profile
 */

describe('Sprint 1: Complete Test Suite', () => {
  let adminToken: string;
  let adminProfileId: string;
  let pinProfileId: string;
  let csrRepProfileId: string;
  let pmProfileId: string;

  // Test user IDs
  let testAdminId: string;
  let testPINId: string;
  let testCSRRepId: string;
  let testPMId: string;

  // ============================================================================
  // SETUP: Create test users for authentication testing
  // ============================================================================
  beforeAll(async () => {
    // Get existing user profiles (from seed)
    const profiles = await Promise.all([
      prisma.userProfile.findUnique({ where: { name: 'User Administrator' } }),
      prisma.userProfile.findUnique({ where: { name: 'Person in Need' } }),
      prisma.userProfile.findUnique({ where: { name: 'CSR Representative' } }),
      prisma.userProfile.findUnique({ where: { name: 'Platform Manager' } }),
    ]);

    if (!profiles[0] || !profiles[1] || !profiles[2] || !profiles[3]) {
      throw new Error('User profiles not found. Please run: npm run seed');
    }

    [adminProfileId, pinProfileId, csrRepProfileId, pmProfileId] = profiles.map(p => p!.id);

    // Create test users
    const hashedPassword = await hashPassword('password123');

    const admin = await prisma.userAccount.create({
      data: {
        email: 'sprint1-admin@test.com',
        password: hashedPassword,
        name: 'Sprint 1 Test Admin',
        userProfileId: adminProfileId,
        status: UserStatus.ACTIVE,
        profileStatus: ProfileStatus.ACTIVE,
      },
    });
    testAdminId = admin.id;

    const pin = await prisma.userAccount.create({
      data: {
        email: 'sprint1-pin@test.com',
        password: hashedPassword,
        name: 'Sprint 1 Test PIN',
        userProfileId: pinProfileId,
        status: UserStatus.ACTIVE,
        profileStatus: ProfileStatus.ACTIVE,
        age: 65,
        location: 'Sydney, NSW',
        phoneNumber: '+61 400 000 001',
        accessibilityNeeds: 'Wheelchair accessible',
      },
    });
    testPINId = pin.id;

    const csrRep = await prisma.userAccount.create({
      data: {
        email: 'sprint1-csr@test.com',
        password: hashedPassword,
        name: 'Sprint 1 Test CSR Rep',
        userProfileId: csrRepProfileId,
        status: UserStatus.ACTIVE,
        profileStatus: ProfileStatus.ACTIVE,
        companyName: 'Sprint 1 Test Company Pty Ltd',
        companyRegistrationNumber: 'ACN999888777',
        industry: 'Technology',
        contactPerson: 'Test Contact',
        phoneNumber: '+61 400 000 002',
        companyAddress: '123 Test St, Sydney NSW 2000',
      },
    });
    testCSRRepId = csrRep.id;

    const pm = await prisma.userAccount.create({
      data: {
        email: 'sprint1-pm@test.com',
        password: hashedPassword,
        name: 'Sprint 1 Test Platform Manager',
        userProfileId: pmProfileId,
        status: UserStatus.ACTIVE,
        profileStatus: ProfileStatus.ACTIVE,
        department: 'Platform Operations',
        phoneNumber: '+61 400 000 003',
      },
    });
    testPMId = pm.id;

    // Login admin for management operations
    const loginResponse = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        email: 'sprint1-admin@test.com',
        password: 'password123',
      });
    adminToken = loginResponse.body.token;
  });

  // ============================================================================
  // CLEANUP: Remove all test data
  // ============================================================================
  afterAll(async () => {
    // Clean up all test users
    await prisma.userAccount.deleteMany({
      where: {
        email: {
          in: [
            'sprint1-admin@test.com',
            'sprint1-pin@test.com',
            'sprint1-csr@test.com',
            'sprint1-pm@test.com',
            'sprint1-new-pin@test.com',
            'sprint1-new-csr@test.com',
            'sprint1-suspend-test@test.com',
            'sprint1-profile-user@test.com',
          ],
        },
      },
    });

    // Clean up test profiles
    await prisma.userProfile.deleteMany({
      where: {
        name: {
          in: [
            'Sprint 1 Test Profile',
            'Sprint 1 Suspend Profile',
          ],
        },
      },
    });
  });

  // ============================================================================
  // AUTHENTICATION TESTS (Stories #1, #2, #13, #14, #24, #25, #33, #34)
  // ============================================================================
  describe('Authentication (8 User Stories)', () => {
    // Story #1: User Admin Login
    describe('Story #1: User Admin Login', () => {
      it('should allow User Admin to login with valid credentials', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'sprint1-admin@test.com',
            password: 'password123',
          })
          .expect(200);

        expect(response.body).toHaveProperty('token');
        expect(response.body.user.role).toBe('User Administrator');
      });

      it('should reject invalid credentials', async () => {
        await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'sprint1-admin@test.com',
            password: 'wrongpassword',
          })
          .expect(401);
      });
    });

    // Story #2: User Admin Logout
    describe('Story #2: User Admin Logout', () => {
      it('should allow User Admin to logout', async () => {
        await request(BASE_URL)
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
      });

      it('should reject logout without token', async () => {
        await request(BASE_URL)
          .post('/api/auth/logout')
          .expect(401);
      });
    });

    // Story #13: PIN Login
    describe('Story #13: PIN Login', () => {
      it('should allow PIN to login with valid credentials', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'sprint1-pin@test.com',
            password: 'password123',
          })
          .expect(200);

        expect(response.body).toHaveProperty('token');
        expect(response.body.user.role).toBe('Person in Need');
      });
    });

    // Story #14: PIN Logout
    describe('Story #14: PIN Logout', () => {
      it('should allow PIN to logout', async () => {
        const loginRes = await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'sprint1-pin@test.com',
            password: 'password123',
          });

        await request(BASE_URL)
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${loginRes.body.token}`)
          .expect(200);
      });
    });

    // Story #24: CSR Rep Login
    describe('Story #24: CSR Rep Login', () => {
      it('should allow CSR Rep to login with valid credentials', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'sprint1-csr@test.com',
            password: 'password123',
          })
          .expect(200);

        expect(response.body).toHaveProperty('token');
        expect(response.body.user.role).toBe('CSR Representative');
      });
    });

    // Story #25: CSR Rep Logout
    describe('Story #25: CSR Rep Logout', () => {
      it('should allow CSR Rep to logout', async () => {
        const loginRes = await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'sprint1-csr@test.com',
            password: 'password123',
          });

        await request(BASE_URL)
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${loginRes.body.token}`)
          .expect(200);
      });
    });

    // Story #33: Platform Manager Login
    describe('Story #33: Platform Manager Login', () => {
      it('should allow Platform Manager to login with valid credentials', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'sprint1-pm@test.com',
            password: 'password123',
          })
          .expect(200);

        expect(response.body).toHaveProperty('token');
        expect(response.body.user.role).toBe('Platform Manager');
      });
    });

    // Story #34: Platform Manager Logout
    describe('Story #34: Platform Manager Logout', () => {
      it('should allow Platform Manager to logout', async () => {
        const loginRes = await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'sprint1-pm@test.com',
            password: 'password123',
          });

        await request(BASE_URL)
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${loginRes.body.token}`)
          .expect(200);
      });
    });
  });

  // ============================================================================
  // USER ACCOUNT MANAGEMENT (Stories #3, #6)
  // ============================================================================
  describe('User Account Management (2 User Stories)', () => {
    // Story #3: Create User Accounts
    describe('Story #3: Create User Accounts', () => {
      it('should allow User Admin to create a PIN account', async () => {
        const newPIN = {
          email: 'sprint1-new-pin@test.com',
          password: 'NewPIN123',
          name: 'New Sprint 1 PIN',
          userProfileId: pinProfileId,
          age: 70,
          location: 'Melbourne, VIC',
          phoneNumber: '+61 400 111 222',
          accessibilityNeeds: 'None',
        };

        const response = await request(BASE_URL)
          .post('/api/admin/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(newPIN)
          .expect(201);

        expect(response.body.user.email).toBe(newPIN.email);
        expect(response.body.user.role).toBe('Person in Need');
      });

      it('should allow User Admin to create a CSR Rep account', async () => {
        const newCSRRep = {
          email: 'sprint1-new-csr@test.com',
          password: 'NewCSR123',
          name: 'New Sprint 1 CSR Rep',
          userProfileId: csrRepProfileId,
          companyName: 'New Sprint 1 Company Pty Ltd',
          companyRegistrationNumber: 'ACN666555444',
          industry: 'Finance',
          contactPerson: 'Jane Doe',
          phoneNumber: '+61 400 333 444',
          companyAddress: '456 Business Rd, Sydney NSW 2000',
        };

        const response = await request(BASE_URL)
          .post('/api/admin/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(newCSRRep)
          .expect(201);

        expect(response.body.user.email).toBe(newCSRRep.email);
        expect(response.body.user.role).toBe('CSR Representative');
      });

      it('should reject duplicate email', async () => {
        await request(BASE_URL)
          .post('/api/admin/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            email: 'sprint1-new-pin@test.com', // Already created above
            password: 'Test123',
            name: 'Duplicate',
            userProfileId: pinProfileId,
          })
          .expect(409);
      });

      it('should reject creation without authentication', async () => {
        await request(BASE_URL)
          .post('/api/admin/users')
          .send({
            email: 'noauth@test.com',
            password: 'Test123',
            name: 'No Auth',
            userProfileId: pinProfileId,
          })
          .expect(401);
      });
    });

    // Story #6: Suspend User Account
    describe('Story #6: Suspend User Account', () => {
      let userToSuspendId: string;

      beforeAll(async () => {
        const hashedPassword = await hashPassword('test123');
        const user = await prisma.userAccount.create({
          data: {
            email: 'sprint1-suspend-test@test.com',
            password: hashedPassword,
            name: 'User To Suspend',
            userProfileId: pinProfileId,
            status: UserStatus.ACTIVE,
            profileStatus: ProfileStatus.ACTIVE,
          },
        });
        userToSuspendId = user.id;
      });

      it('should allow User Admin to suspend a user account', async () => {
        const response = await request(BASE_URL)
          .put(`/api/admin/users/${userToSuspendId}/suspend`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.user.status).toBe(UserStatus.SUSPENDED);
      });

      it('should prevent suspended user from logging in', async () => {
        await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'sprint1-suspend-test@test.com',
            password: 'test123',
          })
          .expect(401);
      });

      it('should allow reactivation of suspended user', async () => {
        await request(BASE_URL)
          .put(`/api/admin/users/${userToSuspendId}/activate`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        // Verify user can login again
        await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'sprint1-suspend-test@test.com',
            password: 'test123',
          })
          .expect(200);
      });
    });
  });

  // ============================================================================
  // USER PROFILE MANAGEMENT (Stories #8, #11)
  // ============================================================================
  describe('User Profile Management (2 User Stories)', () => {
    // Story #8: Create User Profiles
    describe('Story #8: Create User Profiles', () => {
      it('should allow User Admin to create a new user profile', async () => {
        const newProfile = {
          name: 'Sprint 1 Test Profile',
          description: 'Test profile for Sprint 1',
          permissions: { testPermission: true },
        };

        const response = await request(BASE_URL)
          .post('/api/admin/profiles')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(newProfile)
          .expect(201);

        expect(response.body.profile.name).toBe(newProfile.name);
        expect(response.body.profile.isActive).toBe(true);
      });

      it('should reject duplicate profile name', async () => {
        await request(BASE_URL)
          .post('/api/admin/profiles')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: 'Sprint 1 Test Profile', // Already created above
            description: 'Duplicate',
            permissions: {},
          })
          .expect(409);
      });

      it('should reject creation without authentication', async () => {
        await request(BASE_URL)
          .post('/api/admin/profiles')
          .send({
            name: 'Unauthorized Profile',
            description: 'Should fail',
            permissions: {},
          })
          .expect(401);
      });
    });

    // Story #11: Suspend User Profile
    describe('Story #11: Suspend User Profile', () => {
      let profileToSuspendId: string;

      beforeAll(async () => {
        const profile = await prisma.userProfile.create({
          data: {
            name: 'Sprint 1 Suspend Profile',
            description: 'Profile to be suspended',
            permissions: { test: true },
            isActive: true,
          },
        });
        profileToSuspendId = profile.id;

        // Create a user with this profile
        const hashedPassword = await hashPassword('test123');
        await prisma.userAccount.create({
          data: {
            email: 'sprint1-profile-user@test.com',
            password: hashedPassword,
            name: 'User With Profile',
            userProfileId: profileToSuspendId,
            status: UserStatus.ACTIVE,
            profileStatus: ProfileStatus.ACTIVE,
          },
        });
      });

      it('should allow User Admin to suspend a user profile', async () => {
        const response = await request(BASE_URL)
          .put(`/api/admin/profiles/${profileToSuspendId}/suspend`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.profile.isActive).toBe(false);
      });

      it('should allow reactivation of suspended profile', async () => {
        const response = await request(BASE_URL)
          .put(`/api/admin/profiles/${profileToSuspendId}/activate`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.profile.isActive).toBe(true);
      });

      it('should reject suspension without authentication', async () => {
        await request(BASE_URL)
          .put(`/api/admin/profiles/${profileToSuspendId}/suspend`)
          .expect(401);
      });
    });
  });
});

