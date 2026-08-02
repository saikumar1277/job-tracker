"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import type { JobStatus } from "@/app/generated/prisma/enums";

export async function updateJobStatus(jobId: string, status: JobStatus) {
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status,
      // A "nested write": update the Job and create its related history
      // row in one atomic query, instead of two separate round trips.
      statusEvents: {
        create: { status },
      },
    },
  });

  // Tells Next.js the data behind /jobs changed, so it re-sends fresh
  // data to the page instead of us manually refetching on the client.
  revalidatePath("/jobs");
}

// `dateKey` is a plain "YYYY-MM-DD" string (see DatePicker.tsx for why we
// avoid passing/parsing full Date objects across the client/server boundary
// here). We turn it into a [start of day, start of next day) range.
export async function getJobEventsByDate(dateKey: string) {
  const start = new Date(`${dateKey}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return prisma.jobStatusEvent.findMany({
    where: {
      changedAt: {
        gte: start,
        lt: end,
      },
    },
    include: { job: true },
    orderBy: { changedAt: "asc" },
  });
}
