/*
  Warnings:

  - You are about to drop the column `role` on the `user_profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `user_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_profiles_role_key";

-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "role";

-- DropEnum
DROP TYPE "UserProfileRole";

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_name_key" ON "user_profiles"("name");
