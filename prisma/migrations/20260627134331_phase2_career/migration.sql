-- CreateEnum
CREATE TYPE "CareerCategory" AS ENUM ('MEDICINE', 'ENGINEERING', 'DATA_SCIENCE', 'LAW', 'BUSINESS', 'ARTS_HUMANITIES', 'EDUCATION', 'TECHNOLOGY');

-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('SCHOLARSHIP', 'FELLOWSHIP', 'COMPETITION', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('RESEARCHING', 'APPLYING', 'SUBMITTED', 'ADMITTED', 'REJECTED');

-- CreateTable
CREATE TABLE "career_results" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "topMatches" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "type" "OpportunityType" NOT NULL,
    "category" "CareerCategory",
    "description" TEXT NOT NULL,
    "eligibility" TEXT,
    "deadline" TIMESTAMP(3),
    "link" TEXT NOT NULL,
    "level" "AcademicLevel",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_programs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "requirements" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "university_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_applications" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'RESEARCHING',
    "deadline" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "career_results_profileId_idx" ON "career_results"("profileId");

-- CreateIndex
CREATE INDEX "opportunities_type_idx" ON "opportunities"("type");

-- CreateIndex
CREATE INDEX "university_applications_profileId_idx" ON "university_applications"("profileId");

-- AddForeignKey
ALTER TABLE "career_results" ADD CONSTRAINT "career_results_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_applications" ADD CONSTRAINT "university_applications_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
