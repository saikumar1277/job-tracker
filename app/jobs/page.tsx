import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/dal";
import JobsPageClient from "@/app/jobs/jobs-page-client";
import AddJobModal from "@/app/jobs/add-job-modal";
import Signout from "../login/signout";

export default async function JobsPage() {
  // Bounces to /login if nobody's signed in. Everything below only runs
  // for a real, logged-in user.
  const user = await requireUser();

  const jobs = await prisma.job.findMany({
    where: { userId: user.id },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Job Applications</h1>

          <AddJobModal />
        </div>

        <Signout />
      </div>
      <JobsPageClient jobs={jobs} />
    </main>
  );
}
