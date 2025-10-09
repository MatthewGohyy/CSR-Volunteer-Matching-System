# Database Documentation

## Overview

This project uses **PostgreSQL** as the database with **Prisma** as the ORM. The database runs in a Docker container for easy local development.

## Architecture

```
┌─────────────────────────────────────────┐
│         Docker Containers               │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  PostgreSQL  │  │   pgAdmin    │    │
│  │   Port 5432  │  │   Port 5050  │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│          Prisma ORM                     │
│  - Type-safe queries                    │
│  - Auto-generated client                │
│  - Migration management                 │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│      Express.js Application             │
│  - Business logic                       │
│  - API endpoints                        │
│  - Authentication                       │
└─────────────────────────────────────────┘
```

## Database Schema

### Users & Authentication

#### User
- Base user model for authentication
- Fields: `id`, `email`, `password`, `userType`, `status`
- Relations: PIN profile, CSR Rep profile, notifications
- User types: `PIN`, `CSR_REP`, `ADMIN`

#### PIN (Person In Need)
- Extended profile for persons seeking help
- Fields: `name`, `age`, `location`, `phoneNumber`, `accessibilityNeeds`, `profilePhoto`
- Relations: requests, matches

#### CSRRep (CSR Representative)
- Extended profile for company representatives
- Fields: `companyName`, `companyRegistrationNumber`, `industry`, `contactPerson`, `approvalStatus`
- Relations: shortlists, volunteer offers, matches

### Service Management

#### ServiceCategory
- Predefined categories of services
- Examples: Medical, Transportation, Companionship, Home Care, etc.
- Fields: `name`, `description`, `iconUrl`, `isActive`

#### Request
- Service requests posted by PINs
- Fields: `title`, `description`, `urgency`, `dateNeeded`, `location`, `status`
- Statuses: `ACTIVE`, `MATCHED`, `COMPLETED`, `CANCELLED`
- Urgency levels: `LOW`, `MEDIUM`, `HIGH`

### Matching System

#### Shortlist
- CSR reps can save requests they're interested in
- Many-to-many relationship between CSR reps and requests
- Unique constraint: One shortlist entry per CSR rep per request

#### VolunteerOffer
- Formal offers from CSR reps to help with requests
- Fields: `message`, `status`
- Statuses: `PENDING`, `ACCEPTED`, `DECLINED`

#### Match
- Confirmed matches between PINs and CSR reps
- One-to-one relationship with request (one request = one match)
- Fields: `status`, `matchedAt`, `completedAt`, `cancellationReason`
- Statuses: `ACTIVE`, `COMPLETED`, `CANCELLED`

### Notifications

#### Notification
- System notifications for users
- Types: `VOLUNTEER_OFFER`, `OFFER_ACCEPTED`, `OFFER_DECLINED`, `MATCH_CONFIRMED`, etc.
- Fields: `message`, `isRead`, `createdAt`

## Database Relationships

```
User (1) ──── (0..1) PIN
User (1) ──── (0..1) CSRRep
User (1) ──── (0..*) Notification

PIN (1) ──── (0..*) Request
PIN (1) ──── (0..*) Match

CSRRep (1) ──── (0..*) Shortlist
CSRRep (1) ──── (0..*) VolunteerOffer
CSRRep (1) ──── (0..*) Match

Request (1) ──── (0..*) Shortlist
Request (1) ──── (0..*) VolunteerOffer
Request (1) ──── (0..1) Match

ServiceCategory (1) ──── (0..*) Request
```

## Entity-Relationship Diagram

```
┌─────────────┐
│    User     │
│─────────────│
│ id (PK)     │
│ email       │
│ password    │
│ userType    │
│ status      │
└─────────────┘
      │
      ├─────────────────────┐
      │                     │
      ▼                     ▼
┌─────────────┐      ┌─────────────┐
│    PIN      │      │   CSRRep    │
│─────────────│      │─────────────│
│ id (PK)     │      │ id (PK)     │
│ userId (FK) │      │ userId (FK) │
│ name        │      │ companyName │
│ location    │      │ industry    │
└─────────────┘      └─────────────┘
      │                     │
      │              ┌──────┴──────┐
      │              │             │
      ▼              ▼             ▼
┌─────────────┐ ┌──────────┐ ┌────────────────┐
│   Request   │ │Shortlist │ │VolunteerOffer  │
│─────────────│ │──────────│ │────────────────│
│ id (PK)     │ │ id (PK)  │ │ id (PK)        │
│ pinId (FK)  │ │csrRepId  │ │ csrRepId (FK)  │
│categoryId   │ │requestId │ │ requestId (FK) │
│ title       │ └──────────┘ │ status         │
│ description │              └────────────────┘
│ urgency     │
│ status      │
└─────────────┘
      │
      ▼
┌─────────────┐
│    Match    │
│─────────────│
│ id (PK)     │
│ requestId   │
│ csrRepId    │
│ pinId       │
│ status      │
└─────────────┘
```

## Seeded Data

The database is seeded with:

### Users
- **Admin Account**
  - Email: `admin@csr.com`
  - Password: `admin123`
  - Type: `ADMIN`

### Service Categories
1. Medical - Medical appointments, healthcare support
2. Transportation - Rides to appointments, errands
3. Companionship - Social visits, conversation
4. Home Care - Light housework, meal preparation
5. Errands - Grocery shopping, picking up items
6. Technology - Help with devices, online services
7. Other - Other types of assistance

## Prisma Client Usage

### Basic Queries

```typescript
import { prisma } from './config/database';

// Find user by email
const user = await prisma.user.findUnique({
  where: { email: 'admin@csr.com' },
  include: {
    pin: true,
    csrRep: true,
  }
});

// Create a request
const request = await prisma.request.create({
  data: {
    pinId: pinId,
    categoryId: categoryId,
    title: 'Need help with groceries',
    description: 'Weekly grocery shopping',
    urgency: 'MEDIUM',
    status: 'ACTIVE',
  }
});

// Get all active requests with category
const requests = await prisma.request.findMany({
  where: { status: 'ACTIVE' },
  include: {
    category: true,
    pin: {
      include: {
        user: {
          select: {
            email: true,
          }
        }
      }
    }
  },
  orderBy: {
    createdAt: 'desc'
  }
});
```

### Advanced Queries

```typescript
// Create a match with transaction
const match = await prisma.$transaction(async (tx) => {
  // Update request status
  await tx.request.update({
    where: { id: requestId },
    data: { status: 'MATCHED' }
  });

  // Create match
  const newMatch = await tx.match.create({
    data: {
      requestId: requestId,
      csrRepId: csrRepId,
      pinId: pinId,
      status: 'ACTIVE',
    }
  });

  // Create notifications
  await tx.notification.createMany({
    data: [
      {
        userId: pinUserId,
        type: 'MATCH_CONFIRMED',
        message: 'Your request has been matched!',
      },
      {
        userId: csrRepUserId,
        type: 'MATCH_CONFIRMED',
        message: 'You have been matched with a request!',
      }
    ]
  });

  return newMatch;
});
```

## Migrations

### Creating a Migration

```bash
# Create a new migration
npx prisma migrate dev --name add_new_field

# Apply migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Migration Best Practices

1. **Always create migrations** when changing the schema
2. **Test migrations** in development before production
3. **Never modify** generated migration files manually
4. **Use descriptive names** for migrations
5. **Review SQL** in migration files before applying

## Database Maintenance

### Backup

```bash
# Backup database
docker exec csr-platform-db pg_dump -U dev csr_platform > backup.sql

# Restore database
docker exec -i csr-platform-db psql -U dev csr_platform < backup.sql
```

### Reset Database

```bash
# Stop containers and delete all data
docker-compose down -v

# Start fresh
docker-compose up -d
cd server
npx prisma migrate dev
npm run seed
```

### View Database

```bash
# Option 1: Prisma Studio (Recommended)
npx prisma studio

# Option 2: pgAdmin
# Visit http://localhost:5050
# Login: admin@csr.com / admin123

# Option 3: psql command line
docker exec -it csr-platform-db psql -U dev -d csr_platform
```

## Performance Considerations

### Indexes

The schema automatically creates indexes on:
- Primary keys (all `id` fields)
- Foreign keys (all relation fields)
- Unique constraints (`email`, `companyRegistrationNumber`, etc.)
- Composite unique constraints (`csrRepId` + `requestId` in Shortlist)

### Optimization Tips

1. **Use select** to fetch only needed fields
   ```typescript
   const users = await prisma.user.findMany({
     select: {
       id: true,
       email: true,
       // Don't fetch password unnecessarily
     }
   });
   ```

2. **Pagination** for large datasets
   ```typescript
   const requests = await prisma.request.findMany({
     skip: (page - 1) * limit,
     take: limit,
   });
   ```

3. **Use transactions** for related operations
   ```typescript
   await prisma.$transaction([
     prisma.request.update(...),
     prisma.match.create(...),
   ]);
   ```

4. **Include only necessary relations**
   ```typescript
   // Instead of including everything
   const request = await prisma.request.findUnique({
     where: { id },
     include: {
       pin: true,
       category: true,
       // Only include what you need
     }
   });
   ```

## Security Considerations

1. **Password Hashing**: Always hash passwords with bcrypt before storing
2. **Cascade Deletes**: Configured for user data cleanup
3. **Input Validation**: Use Prisma's type safety + express-validator
4. **SQL Injection**: Prisma automatically prevents SQL injection
5. **Environment Variables**: Never commit `.env` file

## Troubleshooting

### Common Issues

1. **Prisma Client Out of Sync**
   ```bash
   npx prisma generate
   ```

2. **Migration Conflicts**
   ```bash
   npx prisma migrate reset
   ```

3. **Connection Refused**
   - Check if Docker is running
   - Check if PostgreSQL container is healthy: `docker ps`
   - Check logs: `docker-compose logs postgres`

4. **Port Already in Use**
   - Change port in `docker-compose.yml`
   - Or stop the service using the port

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

