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

  function handleJobClick(job: JobModel) {
    setSelectedJob(job);
  }

  return (
    <>
      <div
        className={`mt-6 flex flex-row flex-wrap gap-2  ${isPending ? "opacity-60" : ""} `}
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
              className="flex min-h-32 w-[164px] flex-col rounded-lg border-2 border-dashed p-4"
            >
              <div className="flex items-center justify-between  w-max">
                <h2
                  className={`mb-3 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[status]}`}
                >
                  {statusLabels[status]}
                  <span className="opacity-70">({jobsInColumn.length})</span>
                </h2>
              </div>
              <div className="flex flex-col gap-2.5">
                {jobsInColumn.map((job) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={(event) => handleDragStart(event, job.id)}
                    onClick={() => handleJobClick(job)}
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
      <JobDetailsModal
        job={selectedJob}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null);
        }}
      />
    </>
  );
}
