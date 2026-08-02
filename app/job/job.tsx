import { Card, CardContent } from "@/components/ui/card";
import type { JobModel } from "@/app/generated/prisma/models";

// Kept intentionally minimal — full details (role, status, url, dates)
// show up in the JobDetailsModal when the card is clicked.
export default function JobCard({ job }: { job: JobModel }) {
  return (
    <Card size="sm">
      <CardContent>
        <p className="text-sm text-muted-foreground">{job.company}</p>
      </CardContent>
    </Card>
  );
}
