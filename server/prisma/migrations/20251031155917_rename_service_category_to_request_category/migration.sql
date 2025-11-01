-- Rename table from service_categories to request_categories
ALTER TABLE "service_categories" RENAME TO "request_categories";

-- Note: The foreign key constraint name may need to be updated depending on your database
-- If the foreign key constraint name includes "service_categories", it will be automatically updated
-- by PostgreSQL when the table is renamed
