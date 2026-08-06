"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

// "Controlled" component: the parent (JobsPageClient) owns the selected
// date, since it needs that value to filter the board too. We just tell
// the parent when the user picked a new date.
export default function DatePicker({
  selected,
  onSelect,
}: {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}) {
  return (
    <aside className="w-72 shrink-0 space-y-4 p-6">
      <Calendar
        mode="single"
        required
        selected={selected}
        onSelect={onSelect}
        className="rounded-lg border"
      />
      <div className="pb-4">
        <Button variant="outline" onClick={() => onSelect(undefined)}>
          <span>Total Jobs</span>
        </Button>
      </div>
    </aside>
  );
}
