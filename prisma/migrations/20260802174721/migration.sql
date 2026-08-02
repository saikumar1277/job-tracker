/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Job` table. All the data in the column will be lost.
  - Added the required column `url` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "JobStatus" ADD VALUE 'NEEDTOAPPLY';
ALTER TYPE "JobStatus" ADD VALUE 'FOLLOWUP';

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "createdAt",
ADD COLUMN     "url" TEXT NOT NULL;
