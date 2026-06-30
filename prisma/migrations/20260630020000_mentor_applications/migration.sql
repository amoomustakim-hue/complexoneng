-- CreateEnum
CREATE TYPE "MentorApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "mentor_applications" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "expertise" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "linkedin" TEXT,
    "status" "MentorApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentor_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mentor_applications_status_idx" ON "mentor_applications"("status");
