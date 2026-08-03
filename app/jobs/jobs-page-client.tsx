"use client";

import { useMemo, useState } from "react";
import JobsBoard from "@/app/jobs/board";
import DatePicker from "@/app/rightsidewindow/DatePicker";
import { toDateKey } from "@/app/lib/date";
import type { JobModel } from "@/app/generated/prisma/models";

export default function JobsPageClient({ jobs }: { jobs: JobModel[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // No date picked yet -> show every job, unfiltered. Otherwise only jobs
  // applied to on that exact day (compared as "YYYY-MM-DD" strings, since
  // appliedAt also carries a time-of-day that would never match otherwise).
  const visibleJobs = useMemo(() => {
    if (!selectedDate) return jobs;

    const selectedKey = toDateKey(selectedDate);
    return jobs.filter((job) => toDateKey(job.appliedAt) === selectedKey);
  }, [jobs, selectedDate]);

  return (
    <div className="flex flex-row items-start gap-6">
      <JobsBoard jobs={visibleJobs} />
      <DatePicker selected={selectedDate} onSelect={setSelectedDate} />
    </div>
  );
}
