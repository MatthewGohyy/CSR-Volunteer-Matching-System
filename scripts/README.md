# Scripts Directory

This directory contains all shell scripts organized by category for easy navigation and maintenance.

## 📁 Directory Structure

```
scripts/
├── setup/          # Setup and initialization scripts
├── testing/        # Testing and verification scripts
└── utilities/      # Utility and helper scripts
```

## 🚀 Quick Start

### Setup Scripts
- **[setup-db.sh](./setup/setup-db.sh)** - Automated database setup and initialization

### Testing Scripts
- **[test-workflow.sh](./testing/test-workflow.sh)** - Complete user workflow test
- **[test-endpoints.sh](./testing/test-endpoints.sh)** - API endpoint testing
- **[test-remaining-endpoints.sh](./testing/test-remaining-endpoints.sh)** - Additional endpoint tests
- **[test-frontend-workflow.sh](./testing/test-frontend-workflow.sh)** - Frontend workflow testing
- **[test-match-workflow.sh](./testing/test-match-workflow.sh)** - Match workflow testing
- **[verify-test-data.sh](./testing/verify-test-data.sh)** - Verify generated test data

### Utility Scripts
- **[git-helper.sh](./utilities/git-helper.sh)** - Git workflow helper with interactive menu

## 📖 Usage

### Running Scripts

All scripts should be executed from the project root:

```bash
# Setup
./scripts/setup/setup-db.sh

# Testing
./scripts/testing/test-workflow.sh
./scripts/testing/test-endpoints.sh

# Utilities
./scripts/utilities/git-helper.sh
```

### Making Scripts Executable

If you encounter permission errors, make scripts executable:

```bash
chmod +x scripts/**/*.sh
```

## 🔧 Script Categories

### Setup Scripts (`setup/`)
Scripts for initial setup, database configuration, and environment preparation.

### Testing Scripts (`testing/`)
Scripts for testing API endpoints, workflows, and verifying system functionality.

### Utility Scripts (`utilities/`)
Helper scripts for common development tasks like Git operations.

## 📝 Notes

- All scripts assume the server is running on `http://localhost:4000`
- Test scripts require test data to be seeded (see [docs/testing/TEST_DATA_GENERATION_GUIDE.md](../docs/testing/TEST_DATA_GENERATION_GUIDE.md))
- Some scripts require `jq` for JSON parsing: `brew install jq` (macOS) or `apt-get install jq` (Linux)

---

**Last Updated:** November 2025

