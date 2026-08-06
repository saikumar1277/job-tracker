import type { JobStatus } from "@/app/generated/prisma/enums";

// Explicit order (left to right on the board) instead of relying on
// object/enum key order.
export const STATUS_COLUMNS: JobStatus[] = [
  "NEEDTOAPPLY",
  "APPLIED",
  "FOLLOWUP",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
];

export const statusLabels: Record<JobStatus, string> = {
  NEEDTOAPPLY: "Need to Apply",
  APPLIED: "Applied",
  FOLLOWUP: "Follow Up",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

// Tailwind needs full class names at build time (no string concatenation),
// so we map each status to its badge/heading classes up front.
export const statusStyles: Record<JobStatus, string> = {
  NEEDTOAPPLY: "bg-gray-100 text-gray-700",
  APPLIED: "bg-blue-100 text-blue-700",
  FOLLOWUP: "bg-yellow-100 text-yellow-700",
  INTERVIEWING: "bg-amber-100 text-amber-700",
  OFFER: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

// Same status colors, but as a left-edge accent bar for job cards so a
// card's status is visible at a glance without reading the column header.
export const statusAccent: Record<JobStatus, string> = {
  NEEDTOAPPLY: "border-l-gray-400",
  APPLIED: "border-l-blue-400",
  FOLLOWUP: "border-l-yellow-400",
  INTERVIEWING: "border-l-amber-400",
  OFFER: "border-l-green-400",
  REJECTED: "border-l-red-400",
};
