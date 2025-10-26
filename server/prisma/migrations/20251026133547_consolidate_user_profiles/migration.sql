/*
  Migration: Consolidate user profile tables into UserAccount
  
  This migration:
  1. Renames users table to user_accounts
  2. Adds profile-specific columns to user_accounts
  3. Copies data from pins, csr_reps, platform_managers to user_accounts
  4. Updates foreign key constraints to reference user_accounts
  5. Drops the old profile tables
*/

-- Step 1: Rename users table to user_accounts
ALTER TABLE "users" RENAME TO "user_accounts";

-- Step 2: Add new columns to user_accounts
ALTER TABLE "user_accounts" 
  ADD COLUMN IF NOT EXISTS "name" TEXT,
  ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "address" TEXT,
  ADD COLUMN IF NOT EXISTS "dateOfBirth" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "userProfileId" TEXT,
  ADD COLUMN IF NOT EXISTS "age" INTEGER,
  ADD COLUMN IF NOT EXISTS "location" TEXT,
  ADD COLUMN IF NOT EXISTS "accessibilityNeeds" TEXT,
  ADD COLUMN IF NOT EXISTS "profilePhoto" TEXT,
  ADD COLUMN IF NOT EXISTS "companyName" TEXT,
  ADD COLUMN IF NOT EXISTS "companyRegistrationNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "industry" TEXT,
  ADD COLUMN IF NOT EXISTS "contactPerson" TEXT,
  ADD COLUMN IF NOT EXISTS "companyAddress" TEXT,
  ADD COLUMN IF NOT EXISTS "companyLogo" TEXT,
  ADD COLUMN IF NOT EXISTS "department" TEXT,
  ADD COLUMN IF NOT EXISTS "profileStatus" "ProfileStatus" NOT NULL DEFAULT 'ACTIVE';

-- Step 3: Copy data from pins table to user_accounts
UPDATE "user_accounts" ua
SET 
  name = p.name,
  "phoneNumber" = p."phoneNumber",
  age = p.age,
  location = p.location,
  "accessibilityNeeds" = p."accessibilityNeeds",
  "profilePhoto" = p."profilePhoto",
  "profileStatus" = 'ACTIVE'
FROM "pins" p
WHERE ua.id = p."userId";

-- Step 4: Copy data from csr_reps table to user_accounts  
UPDATE "user_accounts" ua
SET 
  "companyName" = c."companyName",
  "companyRegistrationNumber" = c."companyRegistrationNumber",
  industry = c.industry,
  "contactPerson" = c."contactPerson",
  "phoneNumber" = COALESCE(ua."phoneNumber", c."phoneNumber"),
  "companyAddress" = c."companyAddress",
  "companyLogo" = c."companyLogo",
  "profileStatus" = 'ACTIVE'
FROM "csr_reps" c
WHERE ua.id = c."userId";

-- Step 5: Copy data from platform_managers table to user_accounts
UPDATE "user_accounts" ua
SET 
  department = p.department,
  "phoneNumber" = COALESCE(ua."phoneNumber", p.phone),
  "profileStatus" = 'ACTIVE'
FROM "platform_managers" p
WHERE ua.id = p."userId";

-- Step 6: Drop foreign key constraints
ALTER TABLE "requests" DROP CONSTRAINT IF EXISTS "requests_pinId_fkey";
ALTER TABLE "shortlists" DROP CONSTRAINT IF EXISTS "shortlists_csrRepId_fkey";
ALTER TABLE "volunteer_offers" DROP CONSTRAINT IF EXISTS "volunteer_offers_csrRepId_fkey";
ALTER TABLE "matches" DROP CONSTRAINT IF EXISTS "matches_csrRepId_fkey";
ALTER TABLE "matches" DROP CONSTRAINT IF EXISTS "matches_pinId_fkey";
ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "notifications_userId_fkey";

-- Step 7: Re-add foreign key constraints pointing to user_accounts
ALTER TABLE "requests" ADD CONSTRAINT "requests_pinId_fkey" FOREIGN KEY ("pinId") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "shortlists" ADD CONSTRAINT "shortlists_csrRepId_fkey" FOREIGN KEY ("csrRepId") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "volunteer_offers" ADD CONSTRAINT "volunteer_offers_csrRepId_fkey" FOREIGN KEY ("csrRepId") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "matches" ADD CONSTRAINT "matches_csrRepId_fkey" FOREIGN KEY ("csrRepId") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "matches" ADD CONSTRAINT "matches_pinId_fkey" FOREIGN KEY ("pinId") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 8: Add unique constraint for companyRegistrationNumber
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_companyRegistrationNumber_key" UNIQUE ("companyRegistrationNumber");

-- Note: Old tables (pins, csr_reps, platform_managers, users) are preserved but no longer used.
-- They can be dropped manually after verifying data migration was successful.
