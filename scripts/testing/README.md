# Testing Scripts

This directory contains scripts for testing API endpoints, workflows, and verifying system functionality.

## 📄 Scripts

### test-workflow.sh
Complete end-to-end workflow test covering the entire user journey:
- PIN registration
- Request creation
- CSR Rep browsing and shortlisting
- Offer submission
- Match creation and completion

**Usage:**
```bash
./scripts/testing/test-workflow.sh
```

### test-endpoints.sh
Comprehensive API endpoint testing script that tests all refactored controllers:
- Authentication endpoints
- User management endpoints
- Request management endpoints
- Match workflow endpoints

**Usage:**
```bash
./scripts/testing/test-endpoints.sh
```

### test-remaining-endpoints.sh
Tests additional endpoints not covered in the main test suite:
- Decline offer functionality
- Cancel match functionality

**Usage:**
```bash
./scripts/testing/test-remaining-endpoints.sh
```

### test-frontend-workflow.sh
Frontend workflow testing script that simulates the complete offer → match flow:
- Category retrieval
- Request creation
- Offer submission
- Offer acceptance
- Match completion

**Usage:**
```bash
./scripts/testing/test-frontend-workflow.sh
```

### test-match-workflow.sh
Focused testing of the match workflow:
- Offer creation
- Offer acceptance
- Match creation
- Match completion

**Usage:**
```bash
./scripts/testing/test-match-workflow.sh
```

### verify-test-data.sh
Verification script for generated test data:
- Checks data counts
- Verifies data integrity
- Validates relationships

**Usage:**
```bash
./scripts/testing/verify-test-data.sh
```

## 🚀 Quick Start

1. Ensure the server is running:
   ```bash
   cd server && npm run dev
   ```

2. Make scripts executable:
   ```bash
   chmod +x scripts/testing/*.sh
   ```

3. Run tests:
   ```bash
   # Complete workflow test
   ./scripts/testing/test-workflow.sh
   
   # All endpoints
   ./scripts/testing/test-endpoints.sh
   
   # Verify test data
   ./scripts/testing/verify-test-data.sh
   ```

## 📋 Prerequisites

- Server must be running on `http://localhost:4000`
- Test data must be seeded (see [Test Data Generation Guide](../../docs/testing/TEST_DATA_GENERATION_GUIDE.md))
- `jq` installed for JSON parsing: `brew install jq` (macOS)
- `curl` available for HTTP requests

## 📖 Related Documentation

- [Test Data Generation Guide](../../docs/testing/TEST_DATA_GENERATION_GUIDE.md)
- [Browser Test Guide](../../docs/testing/BROWSER_TEST_GUIDE.md)
- [TDD Report](../../docs/testing/TDD_REPORT_SECTION.md)

