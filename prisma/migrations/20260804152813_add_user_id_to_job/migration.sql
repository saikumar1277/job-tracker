-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Job_userId_idx" ON "Job"("userId");
