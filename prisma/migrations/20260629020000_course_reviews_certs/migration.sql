-- DropForeignKey
ALTER TABLE "lesson_answers" DROP CONSTRAINT "lesson_answers_profileId_fkey";

-- DropForeignKey
ALTER TABLE "lesson_answers" DROP CONSTRAINT "lesson_answers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "lesson_notes" DROP CONSTRAINT "lesson_notes_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "lesson_notes" DROP CONSTRAINT "lesson_notes_profileId_fkey";

-- DropForeignKey
ALTER TABLE "lesson_questions" DROP CONSTRAINT "lesson_questions_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "lesson_questions" DROP CONSTRAINT "lesson_questions_profileId_fkey";

-- DropTable
DROP TABLE "lesson_answers";

-- DropTable
DROP TABLE "lesson_notes";

-- DropTable
DROP TABLE "lesson_questions";

-- CreateTable
CREATE TABLE "course_reviews" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_certificates" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "certificateSlug" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "course_reviews_courseId_idx" ON "course_reviews"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_reviews_profileId_courseId_key" ON "course_reviews"("profileId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_certificates_certificateSlug_key" ON "course_certificates"("certificateSlug");

-- CreateIndex
CREATE UNIQUE INDEX "course_certificates_profileId_courseId_key" ON "course_certificates"("profileId", "courseId");

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_certificates" ADD CONSTRAINT "course_certificates_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_certificates" ADD CONSTRAINT "course_certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

