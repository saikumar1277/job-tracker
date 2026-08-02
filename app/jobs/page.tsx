import { prisma } from "@/app/lib/prisma";
import JobsBoard from "@/app/jobs/board";
import DatePicker from "@/app/rightsidewindow/DatePicker";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { appliedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Job Applications</h1>
      <div className="flex flex-row items-start gap-6">
        <span className="flex flex-row items-start gap-6">filter</span>
      </div>

      <p className="mt-1 text-sm text-gray-500">
        {jobs.length} {jobs.length === 1 ? "application" : "applications"}{" "}
        tracked
      </p>
      <div className="flex flex-row items-start gap-6">
        <JobsBoard jobs={jobs} />
        <DatePicker />
      </div>
    </main>
  );
}
