/*
  Warnings:

  - You are about to drop the column `pending` on the `Configuration` table. All the data in the column will be lost.
  - Added the required column `resource` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "pending",
ADD COLUMN     "SecurePercentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "criticalCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "highCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isPending" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lowCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "resources" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "resource" TEXT NOT NULL,
ADD COLUMN     "severity" TEXT NOT NULL;
