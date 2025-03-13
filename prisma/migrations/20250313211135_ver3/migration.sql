/*
  Warnings:

  - You are about to drop the `Issue` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('critical', 'high', 'medium', 'low');

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_configurationId_fkey";

-- DropTable
DROP TABLE "Issue";

-- CreateTable
CREATE TABLE "SecurityIssue" (
    "id" TEXT NOT NULL,
    "configurationId" TEXT NOT NULL,
    "rule_id" TEXT,
    "long_id" TEXT,
    "rule_description" TEXT,
    "rule_provider" TEXT,
    "rule_service" TEXT,
    "impact" TEXT,
    "resolution" TEXT,
    "links" TEXT[],
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "warning" BOOLEAN,
    "status" INTEGER,
    "resource" TEXT NOT NULL,
    "location" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityIssue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SecurityIssue" ADD CONSTRAINT "SecurityIssue_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
