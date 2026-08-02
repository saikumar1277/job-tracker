"use client";

import { useState, useTransition } from "react";
import JobCard from "@/app/job/job";
import JobDetailsModal from "@/app/job/job-details-modal";
import { updateJobStatus } from "@/app/jobs/actions";
import {
  STATUS_COLUMNS,
  statusLabels,
  statusStyles,
} from "@/app/lib/job-status";
import type { JobModel } from "@/app/generated/prisma/models";
import type { JobStatus } from "@/app/generated/prisma/enums";

export default function JobsBoard({ jobs }: { jobs: JobModel[] }) {
  const [isPending, startTransition] = useTransition();
  const [selectedJob, setSelectedJob] = useState<JobModel | null>(null);

  function handleDragStart(
    event: React.DragEvent<HTMLDivElement>,
    jobId: string,
  ) {
    event.dataTransfer.setData("text/plain", jobId);
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    status: JobStatus,
  ) {
    event.preventDefault();
    const jobId = event.dataTransfer.getData("text/plain");
    if (!jobId) return;

    startTransition(() => {
      updateJobStatus(jobId, status);
    });
  }

  return (
    <>
      <div
        className={`mt-6 grid flex-1 grid-cols-6 gap-4 ${isPending ? "opacity-60" : ""}`}
      >
        {STATUS_COLUMNS.map((status) => {
          const jobsInColumn = jobs.filter((job) => job.status === status);

          return (
            <div
              key={status}
              // Dropping is disabled by default in browsers; preventDefault
              // on dragover is what tells the browser "yes, allow a drop here."
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, status)}
              className="min-w-0 rounded-lg  p-2"
            >
              <h2
                className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[status]}`}
              >
                {statusLabels[status]}
                <span className="opacity-70">({jobsInColumn.length})</span>
              </h2>
              <div className="space-y-3">
                {jobsInColumn.map((job) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={(event) => handleDragStart(event, job.id)}
                    onClick={() => setSelectedJob(job)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
