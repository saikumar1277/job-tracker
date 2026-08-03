"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STATUS_COLUMNS, statusLabels } from "@/app/lib/job-status";
import { toDateKey, fromDateKey } from "@/app/lib/date";
import { addJob } from "./actions";
import type { JobStatus } from "@/app/generated/prisma/enums";

// Self-contained: unlike JobDetailsModal/DatePicker, nothing else needs to
// know whether this dialog is open, so it owns its open/closed state
// instead of being controlled by a parent.
export default function AddJobModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    // The <select> only ever offers JobStatus values as options, so this
    // cast (unlike casting an arbitrary DOM node) can't actually mismatch
    // what's on the page.
    const job = {
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      url: formData.get("url") as string,
      status: formData.get("status") as JobStatus,
      appliedAt: fromDateKey(formData.get("appliedAt") as string),
    };

    startTransition(async () => {
      await addJob(job);
      form.reset();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline">Add Job</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Job</DialogTitle>
          <DialogDescription>
            Track a new application on your board.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="url">Job posting URL</Label>
            <Input id="url" name="url" type="url" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue="APPLIED"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {STATUS_COLUMNS.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="appliedAt">Applied on</Label>
            <Input
              id="appliedAt"
              name="appliedAt"
              type="date"
              defaultValue={toDateKey(new Date())}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
