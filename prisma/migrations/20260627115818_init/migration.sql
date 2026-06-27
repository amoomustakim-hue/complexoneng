-- CreateEnum
CREATE TYPE "AcademicLevel" AS ENUM ('SS1', 'SS2', 'SS3', 'JAMB', 'L100', 'L200', 'L300', 'L400', 'POSTGRAD');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('JAMB', 'WAEC', 'NECO', 'POST_UTME');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "level" "AcademicLevel",
    "school" TEXT,
    "targetExam" "ExamType",
    "onboarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "examType" "ExamType" NOT NULL,
    "subject" TEXT NOT NULL,
    "year" INTEGER,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cbt_sessions" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "examType" "ExamType" NOT NULL,
    "subject" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cbt_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_sessions" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "messages" JSONB NOT NULL DEFAULT '[]',
    "context" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coach_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_clerkUserId_key" ON "profiles"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "questions_examType_subject_idx" ON "questions"("examType", "subject");

-- CreateIndex
CREATE INDEX "cbt_sessions_profileId_idx" ON "cbt_sessions"("profileId");

-- CreateIndex
CREATE INDEX "coach_sessions_profileId_idx" ON "coach_sessions"("profileId");

-- AddForeignKey
ALTER TABLE "cbt_sessions" ADD CONSTRAINT "cbt_sessions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_sessions" ADD CONSTRAINT "coach_sessions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
