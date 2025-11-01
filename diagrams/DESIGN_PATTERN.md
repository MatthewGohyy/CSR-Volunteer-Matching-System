# Single Table Inheritance Pattern

## Overview

This project uses the **Single Table Inheritance (STI)** pattern for the UserAccount table. This means ALL user types (PIN, CSR Rep, Platform Manager, User Admin) are stored in **ONE table** with role-specific fields.

## What is Single Table Inheritance?

Single Table Inheritance is a database design pattern where:
- **One table** stores instances of multiple related types
- A discriminator column (here: `userProfileId`) determines the type
- All possible fields for all types are present as columns
- Unused fields are `NULL` for each specific type

## Our Implementation

### Database Structure

```
┌─────────────────┐
│  UserProfile    │  ← 4 static records (roles)
│  - PIN          │
│  - CSR_REP      │
│  - USER_ADMIN   │
│  - PLATFORM_MGR │
└────────┬────────┘
         │ 1:M
         │
┌────────▼────────────────────────────────┐
│         UserAccount                      │
│  (Single Table - All User Types)        │
├──────────────────────────────────────────┤
│ Common Fields:                           │
│  - id, email, password, name             │
│  - phoneNumber, address, status          │
│  - userProfileId → determines role       │
│                                          │
│ PIN-specific Fields (nullable):          │
│  - age                                   │
│  - location                              │
│  - accessibilityNeeds                    │
│  - profilePhoto                          │
│                                          │
│ CSR-specific Fields (nullable):          │
│  - companyName                           │
│  - companyRegistrationNumber             │
│  - industry                              │
│  - contactPerson                         │
│  - companyAddress                        │
│  - companyLogo                           │
│                                          │
│ Platform Manager Fields (nullable):      │
│  - department                            │
└──────────────────────────────────────────┘
```

### Example Data

| id | email | name | userProfileId | age | location | companyName | department |
|----|-------|------|---------------|-----|----------|-------------|------------|
| 1 | john@example.com | John Doe | PIN_ID | 65 | Sydney | NULL | NULL |
| 2 | corp@company.com | Corp Rep | CSR_ID | NULL | NULL | ABC Corp | NULL |
| 3 | admin@system.com | Admin | ADMIN_ID | NULL | NULL | NULL | IT |

**Notice:** Each row has many NULL fields based on the role.

## Advantages ✅

### 1. **Simpler Queries**
```typescript
// No joins needed!
const user = await prisma.userAccount.findUnique({
  where: { email: 'john@example.com' },
  include: { userProfile: true }
});

// Access all fields directly
console.log(user.age);  // For PIN
console.log(user.companyName);  // For CSR Rep
```

### 2. **Faster Development**
- Less code to write
- Fewer entity classes
- No complex join logic
- Easy to understand for new developers

### 3. **Polymorphic Relationships**
```typescript
// One foreign key for all user types
model Request {
  pinId String
  pin   UserAccount @relation(...)  // Could be any role
}
```

### 4. **Role Changes**
- Easy to change a user's role (just update `userProfileId`)
- No need to move data between tables

## Trade-offs ⚠️

### 1. **NULL Fields (Sparse Data)**
- Every user has ~10-15 NULL fields
- Wastes storage space
- Can be confusing which fields apply to which role

### 2. **No Database-Level Type Safety**
```sql
-- Nothing stops this invalid data:
INSERT INTO user_accounts 
VALUES (..., 'PIN_ID', NULL, NULL, 'ABC Corp', ...);
-- A PIN user with a company name!
```

### 3. **Violates Normalization**
- Not in 3rd Normal Form (3NF)
- Database theory purists will object
- Could cause update anomalies

### 4. **Table Bloat**
- As you add more roles, the table gets wider
- Adding new role = adding columns to main table

## Alternative: Class Table Inheritance

The **alternative** (not implemented) would be:

```
UserAccount (common fields)
    ├─→ PIN (PIN-specific fields)
    ├─→ CSRRep (CSR-specific fields)
    └─→ PlatformManager (PM-specific fields)
```

**Pros:**
- ✅ No NULL fields
- ✅ Type-safe at database level
- ✅ Normalized design

**Cons:**
- ❌ Requires JOIN queries
- ❌ More complex code
- ❌ Slower queries
- ❌ More tables to maintain

## When to Use STI vs CTI

### Use **Single Table** (our choice) when:
- ✅ Small-medium number of roles (2-5)
- ✅ Not many role-specific fields (~10-15)
- ✅ Fast development needed
- ✅ Simple queries preferred
- ✅ User volume is moderate (< 100k users)

### Use **Class Table** when:
- ❌ Many roles (5+)
- ❌ Lots of role-specific fields (20+)
- ❌ Need database-level type safety
- ❌ Storage efficiency critical
- ❌ Very large scale (millions of users)

## Implementation Notes

### Validation in Code
Since database can't enforce type safety, we validate in code:

```typescript
class UserAccountEntity {
  validate() {
    if (this.isPIN()) {
      // Ensure PIN-specific fields are present
      if (!this.age || !this.location) {
        throw new Error('PIN must have age and location');
      }
      // Ensure CSR fields are NULL
      if (this.companyName) {
        throw new Error('PIN cannot have company name');
      }
    }
    
    if (this.isCSRRep()) {
      // Ensure CSR-specific fields are present
      if (!this.companyName || !this.companyRegistrationNumber) {
        throw new Error('CSR Rep must have company details');
      }
      // Ensure PIN fields are NULL
      if (this.age) {
        throw new Error('CSR Rep cannot have age');
      }
    }
  }
}
```

### Querying by Role
```typescript
// Get all PINs
const pins = await prisma.userAccount.findMany({
  where: {
    userProfile: {
      name: 'Person in Need'
    }
  }
});

// Get all CSR Reps
const csrReps = await prisma.userAccount.findMany({
  where: {
    userProfile: {
      name: 'CSR Representative'
    }
  }
});
```

## Conclusion

We chose **Single Table Inheritance** because:
1. ⏰ **Faster to implement** (time constraint for project)
2. 📊 **Appropriate scale** (not millions of users)
3. 🧪 **Easier to test** (simpler queries)
4. 👥 **Team familiarity** (easier to understand)

The trade-offs (NULL fields, normalization) are acceptable for this project's scope and scale.

---

**Last Updated:** October 28, 2025
**Pattern:** Single Table Inheritance (STI)
