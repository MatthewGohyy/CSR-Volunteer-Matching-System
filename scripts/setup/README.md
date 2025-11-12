# Setup Scripts

This directory contains scripts for setting up and initializing the CSR Volunteer Matching System.

## 📄 Scripts

### setup-db.sh
Automated database setup script that:
- Starts Docker containers (PostgreSQL, pgAdmin)
- Sets up environment variables
- Runs Prisma migrations
- Seeds the database with initial data
- Verifies the setup

**Usage:**
```bash
./scripts/setup/setup-db.sh
```

**Prerequisites:**
- Docker Desktop must be installed and running
- Node.js and npm installed
- Prisma CLI available

**What it does:**
1. Checks Docker installation
2. Starts Docker Compose services
3. Waits for database to be ready
4. Generates Prisma Client
5. Runs database migrations
6. Seeds the database
7. Verifies the setup

## 🚀 Quick Start

1. Make the script executable:
   ```bash
   chmod +x scripts/setup/setup-db.sh
   ```

2. Run the setup:
   ```bash
   ./scripts/setup/setup-db.sh
   ```

3. Start the development server:
   ```bash
   cd server && npm run dev
   ```

## 📖 Related Documentation

- [Setup Guide](../../docs/setup/START_STOP_GUIDE.md) - Detailed setup instructions
- [Docker Guide](../../docs/setup/DOCKER_GUIDE.md) - Docker configuration

