"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/dal";
import type { JobStatus } from "@/app/generated/prisma/enums";
import type { JobUncheckedCreateInput } from "@/app/generated/prisma/models";

export async function updateJobStatus(jobId: string, status: JobStatus) {
  const user = await requireUser();

  // updateMany (not update) because we're filtering on userId, not just the
  // unique id. If jobId belongs to someone else, userId won't match, zero
  // rows update, and nothing bad happens — instead of one user being able
  // to drag-and-drop-edit another user's job just by knowing its id.
  await prisma.job.updateMany({
    where: { id: jobId, userId: user.id },
    data: {
      status,
    },
  });

  // Tells Next.js the data behind /jobs changed, so it re-sends fresh
  // data to the page instead of us manually refetching on the client.
  revalidatePath("/jobs");
}

export async function addJob(job: Omit<JobUncheckedCreateInput, "userId">) {
  const user = await requireUser();

  await prisma.job.create({
    data: { ...job, userId: user.id },
  });

  revalidatePath("/jobs");
}
