"use client";

import { useState, useTransition } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { getJobEventsByDate } from "@/app/jobs/actions";
import { statusLabels, statusStyles } from "@/app/lib/job-status";

// Deriving the type from the action's own return value instead of hunting
// down a generated Prisma payload type name — TypeScript infers the whole
// shape (job + event fields) for us automatically.
type JobEvent = Awaited<ReturnType<typeof getJobEventsByDate>>[number];

// Build "YYYY-MM-DD" from the calendar's LOCAL date fields. We deliberately
// avoid date.toISOString() here — it converts to UTC first, which can
// silently roll the date back or forward a day depending on your timezone.
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [events, setEvents] = useState<JobEvent[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSelect(selected: Date | undefined) {
    setDate(selected);

    if (!selected) {
      setEvents([]);
      return;
    }

    startTransition(async () => {
      const result = await getJobEventsByDate(toDateKey(selected));
      setEvents(result);
    });
  }

  return (
    <aside className="w-72 shrink-0 space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleSelect}
        className="rounded-lg border"
      />
    </aside>
  );
}
