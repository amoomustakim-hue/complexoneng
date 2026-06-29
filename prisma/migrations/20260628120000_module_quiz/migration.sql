-- AlterTable
ALTER TABLE "course_modules" ADD COLUMN     "quizQuestions" JSONB;

-- CreateTable
CREATE TABLE "module_quiz_attempts" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "module_quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "module_quiz_attempts_profileId_idx" ON "module_quiz_attempts"("profileId");

-- CreateIndex
CREATE INDEX "module_quiz_attempts_moduleId_idx" ON "module_quiz_attempts"("moduleId");

-- AddForeignKey
ALTER TABLE "module_quiz_attempts" ADD CONSTRAINT "module_quiz_attempts_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_quiz_attempts" ADD CONSTRAINT "module_quiz_attempts_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "course_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

