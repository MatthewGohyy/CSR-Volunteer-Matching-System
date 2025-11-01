/*
  Warnings:

  - The values [DEACTIVATED] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userType` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the `csr_reps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `platform_managers` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `user_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userProfileId` on table `user_accounts` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserProfileRole" AS ENUM ('CSR_REP', 'PIN', 'USER_ADMIN', 'PLATFORM_MANAGER');

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
ALTER TABLE "user_accounts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "user_accounts" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "user_accounts" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "csr_reps" DROP CONSTRAINT "csr_reps_userId_fkey";

-- DropForeignKey
ALTER TABLE "pins" DROP CONSTRAINT "pins_userId_fkey";

-- DropForeignKey
ALTER TABLE "platform_managers" DROP CONSTRAINT "platform_managers_userId_fkey";

-- AlterTable
ALTER TABLE "user_accounts" RENAME CONSTRAINT "users_pkey" TO "user_accounts_pkey";
ALTER TABLE "user_accounts" DROP COLUMN "userType";
ALTER TABLE "user_accounts" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "user_accounts" ALTER COLUMN "userProfileId" SET NOT NULL;

-- DropTable
DROP TABLE "csr_reps";

-- DropTable
DROP TABLE "pins";

-- DropTable
DROP TABLE "platform_managers";

-- DropEnum
DROP TYPE "UserType";

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "role" "UserProfileRole" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_role_key" ON "user_profiles"("role");

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "users_email_key" RENAME TO "user_accounts_email_key";
