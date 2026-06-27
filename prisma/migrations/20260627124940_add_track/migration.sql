-- CreateEnum
CREATE TYPE "Track" AS ENUM ('HIGH_SCHOOL', 'UNDERGRAD', 'RESEARCHER');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "courseOfStudy" TEXT,
ADD COLUMN     "researchArea" TEXT,
ADD COLUMN     "researchStage" TEXT,
ADD COLUMN     "track" "Track";
