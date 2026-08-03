import { prisma } from "@/app/lib/prisma";
import JobsPageClient from "@/app/jobs/jobs-page-client";
import AddJobModal from "@/app/jobs/add-job-modal";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { appliedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">Job Applications</h1>
        <AddJobModal />
      </div>
      <JobsPageClient jobs={jobs} />
    </main>
  );
}
