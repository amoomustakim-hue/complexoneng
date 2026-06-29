-- CreateTable
CREATE TABLE "lesson_notes" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_questions" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_answers" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isBest" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lesson_notes_profileId_idx" ON "lesson_notes"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_notes_profileId_lessonId_key" ON "lesson_notes"("profileId", "lessonId");

-- CreateIndex
CREATE INDEX "lesson_questions_lessonId_idx" ON "lesson_questions"("lessonId");

-- CreateIndex
CREATE INDEX "lesson_answers_questionId_idx" ON "lesson_answers"("questionId");

-- AddForeignKey
ALTER TABLE "lesson_notes" ADD CONSTRAINT "lesson_notes_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_notes" ADD CONSTRAINT "lesson_notes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_questions" ADD CONSTRAINT "lesson_questions_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_questions" ADD CONSTRAINT "lesson_questions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_answers" ADD CONSTRAINT "lesson_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "lesson_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_answers" ADD CONSTRAINT "lesson_answers_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

