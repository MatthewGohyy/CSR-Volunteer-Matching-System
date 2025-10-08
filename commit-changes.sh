#!/bin/bash

echo "🚀 Committing Backend & Frontend Integration"
echo "=============================================="
echo ""

# Create feature branch
echo "📝 Creating feature branch..."
git checkout -b feature/backend-frontend-integration

echo ""
echo "📦 Staging all changes..."

# Stage changes by category for better organization
git add docker-compose.yml
git add setup-db.sh
git add test-workflow.sh
git add .gitignore

# Backend
git add server/prisma/
git add server/src/
git add server/package*.json

# Frontend
git add client/public/
git add client/src/config/
git add client/src/services/
git add client/src/types/

# Documentation
git add *.md
git add client/INTEGRATION.md

echo ""
echo "✅ Changes staged!"
echo ""

# Show what will be committed
echo "📋 Files to be committed:"
git status --short

echo ""
echo "💾 Creating commit..."

# Commit with descriptive message
git commit -m "feat: implement complete backend and frontend integration

Backend Implementation:
- Add PostgreSQL database with Docker & Prisma ORM
- Implement 30+ REST API endpoints (auth, requests, matches)
- Create controllers for PIN, CSR Rep, and matching logic
- Add JWT authentication with middleware
- Implement validation and error handling
- Add database migrations and seed data

Frontend Integration:
- Create API services for all backend endpoints
- Add TypeScript types for all API responses
- Configure Axios with auth interceptors
- Implement authService, requestService, matchService
- Add environment configuration

Infrastructure:
- Docker Compose setup for PostgreSQL & pgAdmin
- Automated database setup script
- Complete test workflow script

Documentation:
- API documentation with all endpoints
- Database schema documentation
- Frontend integration guide
- Docker setup guide
- Quick start guide
- Setup success documentation

This completes the full-stack foundation for the CSR Volunteer Matching Platform."

echo ""
echo "✅ Committed successfully!"
echo ""

# Show the commit
git log -1 --stat

echo ""
echo "📤 Ready to push to GitHub!"
echo ""
echo "Run this command to push:"
echo "  git push -u origin feature/backend-frontend-integration"
echo ""
echo "Then create a Pull Request on GitHub! 🎉"

