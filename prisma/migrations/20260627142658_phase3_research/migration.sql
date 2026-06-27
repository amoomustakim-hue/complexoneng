-- CreateEnum
CREATE TYPE "ResearchRequestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "research_requests" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "skillsNeeded" TEXT,
    "budget" TEXT,
    "status" "ResearchRequestStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_offers" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "research_requests_profileId_idx" ON "research_requests"("profileId");

-- CreateIndex
CREATE INDEX "research_offers_requestId_idx" ON "research_offers"("requestId");

-- CreateIndex
CREATE INDEX "research_offers_profileId_idx" ON "research_offers"("profileId");

-- AddForeignKey
ALTER TABLE "research_requests" ADD CONSTRAINT "research_requests_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_offers" ADD CONSTRAINT "research_offers_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "research_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_offers" ADD CONSTRAINT "research_offers_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
