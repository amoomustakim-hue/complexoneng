-- CreateEnum
CREATE TYPE "InternshipStatus" AS ENUM ('APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED');

-- CreateTable
CREATE TABLE "internship_applications" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "industry" TEXT,
    "location" TEXT,
    "status" "InternshipStatus" NOT NULL DEFAULT 'APPLIED',
    "deadline" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internship_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "internship_applications_profileId_idx" ON "internship_applications"("profileId");

-- AddForeignKey
ALTER TABLE "internship_applications" ADD CONSTRAINT "internship_applications_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
