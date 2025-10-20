-- Add status field to profile tables to distinguish between account and profile suspension
-- User Account suspension = cannot login
-- User Profile suspension = can login but cannot perform role-specific tasks

-- Create ProfileStatus enum (same as UserStatus)
CREATE TYPE "ProfileStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- Add status to PIN table
ALTER TABLE "pins" ADD COLUMN "status" "ProfileStatus" NOT NULL DEFAULT 'ACTIVE';

-- Add status to CSRRep table
ALTER TABLE "csr_reps" ADD COLUMN "status" "ProfileStatus" NOT NULL DEFAULT 'ACTIVE';

-- Add status to PlatformManager table
ALTER TABLE "platform_managers" ADD COLUMN "status" "ProfileStatus" NOT NULL DEFAULT 'ACTIVE';

-- Add indexes for better query performance
CREATE INDEX "pins_status_idx" ON "pins"("status");
CREATE INDEX "csr_reps_status_idx" ON "csr_reps"("status");
CREATE INDEX "platform_managers_status_idx" ON "platform_managers"("status");

