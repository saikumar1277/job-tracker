"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { statusLabels, statusStyles } from "@/app/lib/job-status";
import type { JobModel } from "@/app/generated/prisma/models";
import { Button } from "@/components/ui/button";
import AddJobModal from "@/app/jobs/add-job-modal";
import { deleteJob } from "@/app/jobs/actions";
import { useRouter } from "next/navigation";
export default function JobDetailsModal({
  job,
  onOpenChange,
}: {
  job: JobModel | null;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const handleDelete = (jobId: string) => {
    deleteJob(jobId);
    onOpenChange(false);
    router.push("/jobs");
  };
  return (
    // "Controlled" dialog: this component doesn't own open/closed state
    // itself — the parent (JobsBoard) does, via `job` being null or not.
    // We just tell the parent when the user asked to close it.
    <Dialog open={job !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {job && (
          <>
            <DialogHeader>
              <DialogTitle>{job.role}</DialogTitle>
              <DialogDescription>{job.company}</DialogDescription>
            </DialogHeader>

            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <Badge className={statusStyles[job.status]}>
                    {statusLabels[job.status]}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Applied</dt>
                <dd className="font-medium">
                  {job.appliedAt.toLocaleDateString()}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="shrink-0 text-muted-foreground">Job posting</dt>
                <dd className="truncate font-medium">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    {job.url}
                  </a>
                </dd>
              </div>
              <AddJobModal jobData={job} onOpenChange={onOpenChange} />
              <Button variant="outline" onClick={() => handleDelete(job.id)}>
                Delete
              </Button>
            </dl>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
