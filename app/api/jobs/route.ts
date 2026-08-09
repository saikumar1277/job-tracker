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
// unlike the `addJob` server action this is a plain JSON HTTP endpoint —
// authenticated with a personal API key instead of the dashboard's login
// cookie (the extension has no access to that cookie).
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const apiKey = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing Authorization: Bearer <api key> header" },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({ where: { apiKey } });

  if (!user) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

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
    data: { company, role, url, status, userId: user.id },
  });

  return NextResponse.json({ job }, { status: 201 });
}
