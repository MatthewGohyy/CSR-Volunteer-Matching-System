-- AlterTable
ALTER TABLE "request_categories" RENAME CONSTRAINT "service_categories_pkey" TO "request_categories_pkey";

-- RenameIndex
ALTER INDEX "service_categories_name_key" RENAME TO "request_categories_name_key";
