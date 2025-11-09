# Sprint 1 TDD Guide

## 📋 Overview

Single comprehensive test suite for all 12 Sprint 1 user stories using Test-Driven Development.

## 🎯 Coverage

### All 12 Sprint 1 User Stories ✅

**Authentication (8 stories)**:
- #1, #2: User Admin login/logout
- #13, #14: PIN login/logout
- #24, #25: CSR Rep login/logout
- #33, #34: Platform Manager login/logout

**User Management (4 stories)**:
- #3: Create user accounts
- #6: Suspend user account
- #8: Create user profiles
- #11: Suspend user profile

## 📁 Test Structure

**Single Test File**: `server/tests/sprint1.test.ts`
- **~25 test cases** covering all 12 user stories
- Uses **real test data** from Faker.js generated database
- Creates isolated test users for each test run
- Automatic cleanup after tests

## 🚀 Running Tests

### Prerequisites

1. **Database with test data**:
   ```bash
   docker-compose up -d
   cd server
   npm run seed:large  # Generates 105 users with Faker.js
   ```

2. **Server running**:
   ```bash
   npm run dev  # In separate terminal
   ```

### Run Tests

```bash
# Run all Sprint 1 tests
npm run test:sprint1

# With coverage report
npm run test:sprint1:coverage

# Watch mode (auto-rerun on changes)
npm run test:sprint1:watch
```

## 📊 Test Data

### Two Types of Data:

**1. Faker.js Generated Data (for system simulation)**
- 105 user accounts in database
- 127 requests, 106 offers, 36 matches, 320+ notifications
- Generated with: `npm run seed:large`
- Used for: Manual testing, demo, system simulation

**2. Test-Specific Data (for automated tests)**
- Created fresh for each test run
- Isolated test users (won't interfere with Faker data)
- Automatically cleaned up after tests
- Used for: Automated test execution

### Test Users Created:
- `sprint1-admin@test.com` - User Administrator
- `sprint1-pin@test.com` - Person in Need
- `sprint1-csr@test.com` - CSR Representative
- `sprint1-pm@test.com` - Platform Manager

All use password: `password123`

## 🧪 Test Categories

### ✅ Positive Tests
- Valid login for all 4 user types
- Successful logout
- Create user accounts (PIN, CSR Rep)
- Create user profiles
- Suspend/activate accounts and profiles

### ❌ Negative Tests
- Invalid credentials
- Missing authentication
- Duplicate email/name
- Missing required fields

### 🔒 Security Tests
- Authentication required
- Authorization checks
- Suspended user login prevention

## 📈 Expected Results

```
PASS  tests/sprint1.test.ts
  Sprint 1: Complete Test Suite
    Authentication (8 User Stories)
      Story #1: User Admin Login
        ✓ should allow User Admin to login with valid credentials
        ✓ should reject invalid credentials
      Story #2: User Admin Logout
        ✓ should allow User Admin to logout
        ✓ should reject logout without token
      ...
    User Account Management (2 User Stories)
      Story #3: Create User Accounts
        ✓ should allow User Admin to create a PIN account
        ✓ should allow User Admin to create a CSR Rep account
        ...
      Story #6: Suspend User Account
        ✓ should allow User Admin to suspend a user account
        ...
    User Profile Management (2 User Stories)
      Story #8: Create User Profiles
        ✓ should allow User Admin to create a new user profile
        ...
      Story #11: Suspend User Profile
        ✓ should allow User Admin to suspend a user profile
        ...

Test Suites: 1 passed, 1 total
Tests:       25+ passed, 25+ total
Time:        ~10s
```

## 🔧 Troubleshooting

**Issue**: Tests fail with "profiles not found"  
**Solution**: Run `npm run seed` or `npm run seed:large` first

**Issue**: Tests timeout  
**Solution**: Ensure server is running on port 4000

**Issue**: Connection refused  
**Solution**: Start Docker: `docker-compose up -d`

## 📚 For Your Report

### Concise TDD Description:

> **Test-Driven Development**: Implemented comprehensive automated test suite using Jest and Supertest, achieving 100% coverage of Sprint 1's 12 user stories. Single test file (`sprint1.test.ts`) contains 25+ test cases validating authentication (all 4 user types), user account management (create/suspend), and user profile management (create/suspend). Tests utilize both Faker.js-generated database records (105 users) for system simulation and isolated test users for automated validation. Architecture ensures test independence with automatic setup/cleanup, proper error handling verification, and security/authorization checks.

**Key Metrics**:
- 1 test suite
- 25+ test cases  
- 12/12 user stories (100%)
- Execution time: ~10 seconds

## ✅ Quick Commands

```bash
# Test Data
npm run seed:large              # Generate 105 users

# Testing
npm run test:sprint1            # Run tests
npm run test:sprint1:coverage   # With coverage
npm run test:sprint1:watch      # Watch mode

# Development
npm run dev                     # Start server
docker-compose up -d            # Start database
```

---

**Status**: ✅ Complete  
**Test File**: `server/tests/sprint1.test.ts`  
**Coverage**: 12/12 Sprint 1 user stories (100%)

