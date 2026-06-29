-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "guardianSlug" TEXT,
ADD COLUMN     "guardianAccess" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "module_quiz_attempts" ADD COLUMN     "questionsUsed" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_guardianSlug_key" ON "profiles"("guardianSlug");
