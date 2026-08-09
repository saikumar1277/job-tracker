"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import type { JobStatus } from "@/app/generated/prisma/enums";
import type {
  JobCreateInput,
  JobUpdateInput,
} from "@/app/generated/prisma/models";

export async function updateJobStatus(jobId: string, status: JobStatus) {
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status,
    },
  });

  // Tells Next.js the data behind /jobs changed, so it re-sends fresh
  // data to the page instead of us manually refetching on the client.
  revalidatePath("/jobs");
}

export async function addJob(job: JobCreateInput) {
  await prisma.job.create({
    data: job,
  });

  revalidatePath("/jobs");
}

export async function editJob(job: JobUpdateInput) {
  await prisma.job.update({
    where: { id: job.id as string },
    data: job,
  });

  revalidatePath("/jobs");
}

export async function deleteJob(jobId: string) {
  await prisma.job.delete({
    where: { id: jobId },
  });

  revalidatePath("/jobs");
}
