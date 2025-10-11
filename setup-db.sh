#!/bin/bash

# CSR Platform - PostgreSQL & Prisma Setup Script
# This script automates the database setup process

set -e

echo "🚀 Starting CSR Platform Database Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
echo -e "${BLUE}📦 Checking Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}❌ Docker is not running. Please start Docker Desktop and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Start Docker containers
echo -e "${BLUE}🐳 Starting PostgreSQL and pgAdmin containers...${NC}"
docker-compose up -d
echo -e "${GREEN}✅ Containers started${NC}"
echo ""

# Wait for PostgreSQL to be ready
echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 5
echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
echo ""

# Navigate to server directory
cd server

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}📝 Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo ""
else
    echo -e "${YELLOW}ℹ️  .env file already exists${NC}"
    echo ""
fi

# Install dependencies
echo -e "${BLUE}📚 Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Generate Prisma Client
echo -e "${BLUE}🔧 Generating Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Run migrations
echo -e "${BLUE}🗄️  Running database migrations...${NC}"
npx prisma migrate dev --name init
echo -e "${GREEN}✅ Migrations completed${NC}"
echo ""

# Seed database
echo -e "${BLUE}🌱 Seeding database...${NC}"
npm run seed
echo -e "${GREEN}✅ Database seeded${NC}"
echo ""

# Success message
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Setup Complete! Your CSR Platform is ready!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📋 Access Information:${NC}"
echo -e "   🌐 Server:        http://localhost:4000/health"
echo -e "   🗄️  Database Test: http://localhost:4000/api/test-db"
echo -e "   🛠️  pgAdmin:       http://localhost:5050"
echo -e "   📊 Prisma Studio: Run 'npx prisma studio' in server/"
echo ""
echo -e "${BLUE}🔑 Test Credentials:${NC}"
echo -e "   Admin:    admin@csr.com / admin123"
echo -e "   pgAdmin:  admin@csr.com / admin123"
echo ""
echo -e "${BLUE}🚀 Start Development Server:${NC}"
echo -e "   cd server && npm run dev"
echo ""
echo -e "${BLUE}📚 Useful Commands:${NC}"
echo -e "   docker-compose up -d          # Start containers"
echo -e "   docker-compose down           # Stop containers"
echo -e "   npx prisma studio             # Open database GUI"
echo -e "   npx prisma migrate dev        # Create new migration"
echo -e "   npm run seed                  # Seed database"
echo ""

