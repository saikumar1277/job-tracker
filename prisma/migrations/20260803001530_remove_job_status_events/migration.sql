-- DropForeignKey
ALTER TABLE "JobStatusEvent" DROP CONSTRAINT "JobStatusEvent_jobId_fkey";

-- DropTable
DROP TABLE "JobStatusEvent";
