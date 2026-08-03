import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.job.createMany({
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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
