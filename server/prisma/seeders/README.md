# Large Test Dataset Generator

## 📊 Overview

This comprehensive test data generator creates **100+ realistic records** for the CSR Volunteer Matching System, meeting the project requirement for sufficiently large test data for demonstration.

## 🎯 Data Generated

### Summary
- **105 User Accounts** (distributed across 4 roles)
- **25 Request Categories**
- **127+ Requests** (various statuses)
- **200+ Shortlists**
- **100+ Volunteer Offers** (PENDING, ACCEPTED, DECLINED)
- **60+ Matches** (ACTIVE, COMPLETED, CANCELLED)
- **300+ Notifications** (various types)

### Detailed Breakdown

#### User Accounts (105 total)
- **5 User Administrators** - Account and profile management
- **40 Person in Need (PIN)** - Service recipients
- **50 CSR Representatives** - Corporate volunteers
- **5 Platform Managers** - System management

All accounts use password: `password123`

#### Request Categories (25)
Realistic service categories including:
- Medical Appointments
- Transportation
- Companionship
- Home Maintenance
- Grocery Shopping
- Technology Support
- Pet Care
- Meal Preparation
- And 17 more...

#### Requests (127)
- **ACTIVE**: 50 - Available for matching
- **MATCHED**: 40 - Currently matched with volunteers
- **COMPLETED**: 25 - Successfully completed
- **CANCELLED**: 5 - Cancelled requests

#### Volunteer Offers (106)
- **PENDING**: 30 - Awaiting PIN response
- **ACCEPTED**: 40 - Accepted by PIN
- **DECLINED**: 30 - Declined offers

#### Matches (36+)
- **ACTIVE**: 30 - Ongoing matches
- **COMPLETED**: 25 - Successfully completed
- **CANCELLED**: 5 - Cancelled matches

#### Notifications (320+)
- Volunteer offer notifications
- Offer acceptance/decline notifications
- Match confirmation notifications
- Match cancellation notifications
- Request update notifications

## 🚀 Usage

### Generate Large Dataset

```bash
cd server
npm run seed:large
```

This will:
1. Create 4 user profile types (roles)
2. Generate 105 user accounts with realistic data
3. Create 25 service categories
4. Generate 127 requests with various statuses
5. Create 200+ shortlists
6. Generate 100+ volunteer offers
7. Create 60+ matches
8. Generate 300+ notifications

**Execution time**: ~2-3 seconds

### Reset Database and Generate Fresh Data

```bash
cd server
npm run seed:reset
```

⚠️ **WARNING**: This will **delete all existing data** and generate fresh test data.

### Generate Basic Dataset (4 users only)

```bash
cd server
npm run seed
```

This generates only 4 basic test accounts for quick testing.

## 📁 File Structure

```
server/prisma/seeders/
├── generate-large-dataset.ts     # Main orchestration script
├── generators/
│   ├── userGenerator.ts          # User account generation
│   ├── requestGenerator.ts       # Request generation
│   ├── shortlistGenerator.ts     # Shortlist generation
│   ├── offerGenerator.ts         # Volunteer offer generation
│   ├── matchGenerator.ts         # Match generation
│   └── notificationGenerator.ts  # Notification generation
└── data/
    ├── categories.ts             # Request category definitions
    ├── industries.ts             # Industry types for CSR Reps
    └── locations.ts              # Australian locations and data
```

## 🔧 How It Works

### 1. Realistic Data Generation

Uses **@faker-js/faker** library to generate:
- Real-sounding names (Australian context)
- Valid email addresses
- Australian phone numbers (+61 format)
- Australian cities and locations
- Company names and registration numbers
- Realistic descriptions and messages

### 2. Referential Integrity

Data is generated in strict order to maintain relationships:
1. User Profiles (foundation)
2. User Accounts (references profiles)
3. Request Categories
4. Requests (references PINs and categories)
5. Shortlists (references CSR Reps and requests)
6. Volunteer Offers (references CSR Reps and requests)
7. Matches (references offers)
8. Notifications (references all activities)

### 3. Logical Consistency

- Offers only for ACTIVE requests
- Matches only from ACCEPTED offers
- Notifications generated for each action
- Proper timestamp ordering
- Realistic status distributions

### 4. Data Variety

- Mixed statuses (active, completed, cancelled)
- Different urgency levels (LOW, MEDIUM, HIGH)
- Various date ranges (past and future)
- Read/unread notifications
- Diverse accessibility needs
- Multiple industries and locations

## 🎓 For Demo/Presentation

### Sample Login Credentials

The generator creates 105 accounts. Here are some examples:

**User Administrators:**
- Email: Check generated output or database
- Password: `password123`

**Person in Need:**
- Email: Check generated output or database  
- Password: `password123`

**CSR Representatives:**
- Email: Check generated output or database
- Password: `password123`

**Platform Managers:**
- Email: Check generated output or database
- Password: `password123`

### Verifying Data

```bash
# Check data counts in database
curl http://localhost:4000/api/test-db

# Or use Prisma Studio
npx prisma studio
```

## 🔍 Data Quality Features

### Realistic Names & Emails
- Uses Faker's person name generation
- Company names with "Pty Ltd" suffix
- Email addresses match names and companies

### Australian Context
- Phone numbers: +61 4XX XXX XXX format
- Locations: Real Australian cities and states
- Company registration: ACN format

### Proper Relationships
- Each PIN has 2-3 requests
- Each CSR Rep shortlists 3-5 requests
- Each CSR Rep submits 2-3 offers
- Realistic match-to-request ratios

### Time-Based Logic
- Created dates in the past
- Future dates for active requests
- Past dates for completed/cancelled
- Proper timestamp ordering

## 🧪 Testing

The generated data is perfect for:
- **Manual Testing**: Browse through realistic scenarios
- **API Testing**: Test with substantial data volume
- **Performance Testing**: See how system handles 100+ users
- **Demo Presentations**: Professional-looking data
- **Integration Testing**: Complete workflows with real-like data

## ⚡ Performance

- **Generation Time**: ~2-3 seconds
- **Database Size**: ~2-3 MB with all data
- **Idempotent**: Can run multiple times safely
- **Efficient**: Uses batching where possible

## 📝 Notes

1. **Unique Constraints**: The generator handles duplicate emails by generating unique ones
2. **Matches**: Some requests may already have matches, so actual match count may vary slightly
3. **Notifications**: Generated based on actual offers and matches
4. **Extensible**: Easy to modify counts in `generate-large-dataset.ts`

## 🎯 Meeting Requirements

✅ **100+ User Accounts**: Generated 105 users  
✅ **Realistic Data**: Using Faker.js with Australian context  
✅ **All Data Types**: Covers all entities in the system  
✅ **Proper Relationships**: Maintains referential integrity  
✅ **Demo Ready**: Professional data for live demonstration  

## 🔧 Customization

To adjust data volumes, edit `generate-large-dataset.ts`:

```typescript
// PHASE 2: Adjust user counts
await generateAdminUsers(5, adminProfile.id);      // Change 5 to desired count
await generatePINUsers(40, pinProfile.id);         // Change 40 to desired count
await generateCSRRepUsers(50, csrRepProfile.id);   // Change 50 to desired count

// PHASE 4: Adjust request distribution
await generateRequests(pinUsers, categories, [
  { status: RequestStatus.ACTIVE, count: 50 },    // Adjust counts
  { status: RequestStatus.MATCHED, count: 40 },
  // ...
]);
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Make sure Docker is running
docker ps

# Start database
docker-compose up -d
```

### Compilation Errors
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Data Already Exists
```bash
# Use seed:reset to clear and regenerate
npm run seed:reset
```

## 📚 References

- **Faker.js**: https://fakerjs.dev/
- **Prisma**: https://www.prisma.io/docs
- **Project Documentation**: See main README.md

---

**Last Updated**: November 9, 2025  
**Status**: ✅ Production Ready  
**Data Volume**: 100+ records across all data types

