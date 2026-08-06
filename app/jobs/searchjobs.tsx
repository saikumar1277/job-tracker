"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SearchIcon } from "lucide-react";
import JobDetailsModal from "@/app/job/job-details-modal";
import { statusLabels, statusStyles } from "@/app/lib/job-status";
import type { JobModel } from "@/app/generated/prisma/models";

const MAX_RESULTS = 8;

// Always-visible search bar (no button to click first). Whether the
// results dropdown shows is derived straight from `query` — there's no
// separate "is it open" flag to keep in sync with the text.
export default function SearchJobs({ jobs }: { jobs: JobModel[] }) {
  const [query, setQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobModel | null>(null);

  const trimmedQuery = query.trim();
  const isOpen = trimmedQuery !== "";

  const matches = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return [];

    return jobs
      .filter(
        (job) =>
          job.company.toLowerCase().includes(q) ||
          job.role.toLowerCase().includes(q),
      )
      .slice(0, MAX_RESULTS);
  }, [jobs, trimmedQuery]);

  function handleSelectJob(job: JobModel) {
    setSelectedJob(job);
    setQuery("");
  }

  return (
    <>
      <div className="relative w-[339px]">
        {/* Sits above the backdrop below (z-40 < z-50) so the bar stays
            clickable/typeable while the dropdown is open. Without this
            explicit z-index, a plain (non-positioned) input paints behind
            any positioned overlay, even one added later in the DOM. */}
        <div className="relative z-50">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by company or role..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setQuery("");
            }}
            className="pl-8"
          />
        </div>

        {isOpen && (
          <>
            {/* Click-anywhere-outside-to-dismiss backdrop, blurring the
                rest of the board behind it. */}
            <div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setQuery("")}
            />

            <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-80 space-y-1 overflow-y-auto rounded-xl border bg-popover p-2 text-sm shadow-lg ring-1 ring-foreground/10">
              {matches.length === 0 && (
                <p className="py-6 text-center text-muted-foreground">
                  No jobs match &ldquo;{trimmedQuery}&rdquo;.
                </p>
              )}

              {matches.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => handleSelectJob(job)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {job.company}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {job.role}
                    </span>
                  </span>
                  <Badge className={statusStyles[job.status]}>
                    {statusLabels[job.status]}
                  </Badge>
                </button>
              ))}
            </div>
          </>
        )}
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
