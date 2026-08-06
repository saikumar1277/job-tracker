import { Card, CardContent } from "@/components/ui/card";
import { statusAccent } from "@/app/lib/job-status";
import type { JobModel } from "@/app/generated/prisma/models";

// Company + role only — full details (status, url, dates) show up in the
// JobDetailsModal when the card is clicked. The left border color mirrors
// the job's status so it's readable at a glance.
export default function JobCard({ job }: { job: JobModel }) {
  return (
    <Card
      size="sm"
      className={`border-l-4 ${statusAccent[job.status]} shadow-sm transition-all duration-150 hover:-translate-y-0.2 hover:shadow-md`}
    >
      <CardContent className="space-y-0.2">
        <p className="truncate text-sm font-medium text-foreground">
          {job.company}
        </p>
        <p className="truncate text-xs text-muted-foreground">{job.role}</p>
      </CardContent>
    </Card>
  );
}
