# PostgreSQL + Prisma Setup Guide

## Prerequisites
- Docker Desktop installed
- Node.js (v18+) installed
- Terminal/Command Prompt

## Quick Setup (First Time)

### 1. Start Docker Database
```bash
# From project root
docker-compose up -d
```

### 2. Install Dependencies
```bash
cd server
npm install
```

### 3. Initialize Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Verify Setup
- Server: http://localhost:3000/health
- Database Test: http://localhost:3000/api/test-db
- pgAdmin: http://localhost:5050

## Test Credentials

### Admin Account
- Email: `admin@csr.com`
- Password: `admin123`

### pgAdmin (Database GUI)
- URL: http://localhost:5050
- Email: `admin@csr.com`
- Password: `admin123`

### Database Connection (for pgAdmin)
- Host: `postgres` (or `localhost` if connecting from outside Docker)
- Port: `5432`
- Database: `csr_platform`
- Username: `dev`
- Password: `dev123`

## Useful Commands

### Docker Management
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f postgres

# Stop and delete all data (CAUTION!)
docker-compose down -v
```

### Prisma Commands
```bash
# Open Prisma Studio (Database GUI)
npx prisma studio

# Generate Prisma Client (after schema changes)
npx prisma generate

# Create new migration
npx prisma migrate dev --name <migration_name>

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Apply migrations to production
npx prisma migrate deploy

# Seed database
npm run seed
```

### Development
```bash
# Start dev server
npm run dev

# Run with file watching
npm run dev:watch

# Run tests
npm test

# Type check
npm run type-check

# Lint code
npm run lint
```

## Team Onboarding (One Command)

New team members can set up everything with:

```bash
# From project root
docker-compose up -d && cd server && npm install && npx prisma generate && npx prisma migrate dev && npm run seed && npm run dev
```

## Database Schema

The database includes the following models:

- **User** - Base user authentication
- **PIN** - Person In Need profile
- **CSRRep** - CSR Representative profile
- **ServiceCategory** - Categories of services
- **Request** - Service requests from PINs
- **Shortlist** - CSR reps' saved requests
- **VolunteerOffer** - Offers from CSR reps to help
- **Match** - Confirmed matches between PINs and CSR reps
- **Notification** - User notifications

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 5432
lsof -i :5432

# Or use different ports in docker-compose.yml
ports:
  - "5433:5432"  # Change 5432 to 5433
```

### Database Connection Failed
```bash
# Check if Docker is running
docker ps

# Restart containers
docker-compose restart

# Check logs
docker-compose logs postgres
```

### Prisma Client Not Found
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Migration Failed
```bash
# Reset database and migrations
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Apply all migrations
# 4. Run seed script
```

## Environment Variables

Create a `.env` file in the `server` directory with:

```env
DATABASE_URL="postgresql://dev:dev123@localhost:5432/csr_platform"
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## Production Deployment

For production, update the following:

1. Change database credentials in docker-compose.yml
2. Update `.env` with production values
3. Use strong passwords
4. Enable SSL/TLS for database connections
5. Run migrations with `npx prisma migrate deploy`

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

