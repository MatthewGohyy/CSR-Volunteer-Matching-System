-- CreateTable
CREATE TABLE "platform_managers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "department" TEXT,
    "phone" TEXT,

    CONSTRAINT "platform_managers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_managers_userId_key" ON "platform_managers"("userId");

-- AddForeignKey
ALTER TABLE "platform_managers" ADD CONSTRAINT "platform_managers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
