import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // createManyAndReturn (not createMany) because we need each job's
  // generated `id` back, to create a matching first history event below.
  const jobs = await prisma.job.createManyAndReturn({
    data: [
      {
        company: "Acme Corp",
        role: "Frontend Developer",
        status: "APPLIED",
        url: "https://example.com/jobs/acme-frontend",
      },
      {
        company: "Globex",
        role: "Backend Engineer",
        status: "INTERVIEWING",
        url: "https://example.com/jobs/globex-backend",
      },
      {
        company: "Initech",
        role: "Full Stack Developer",
        status: "OFFER",
        url: "https://example.com/jobs/initech-fullstack",
      },
      {
        company: "Umbrella Corp",
        role: "React Developer",
        status: "REJECTED",
        url: "https://example.com/jobs/umbrella-react",
      },
    ],
  });

  // Every job needs at least one history event, or it'll never show up
  // when someone filters the board by date.
  await prisma.jobStatusEvent.createMany({
    data: jobs.map((job) => ({
      jobId: job.id,
      status: job.status,
      changedAt: job.appliedAt,
    })),
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
