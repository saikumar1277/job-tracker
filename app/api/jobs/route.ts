import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import type { JobStatus } from "@/app/generated/prisma/enums";

const VALID_STATUSES: JobStatus[] = [
  "NEEDTOAPPLY",
  "APPLIED",
  "FOLLOWUP",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
];

// Called by the browser extension (not by the dashboard UI itself), so
// unlike the `addJob` server action this is a plain JSON HTTP endpoint.
export async function POST(request: Request) {
  const body = await request.json();
  const { company, role, url, status } = body ?? {};

  if (!company || !role || !url) {
    return NextResponse.json(
      { error: "company, role and url are required" },
      { status: 400 },
    );
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 },
    );
  }

  const job = await prisma.job.create({
    data: { company, role, url, status },
  });

  return NextResponse.json({ job }, { status: 201 });
}
