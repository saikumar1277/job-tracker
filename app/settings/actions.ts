"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/dal";

export async function generateApiKey() {
  const user = await requireUser();

  // 24 random bytes -> a ~32 character URL-safe string. Prefixed so it's
  // recognizable at a glance (e.g. in logs) as a Handy extension key.
  const apiKey = `handy_${randomBytes(24).toString("base64url")}`;

  await prisma.user.update({
    where: { id: user.id },
    data: { apiKey },
  });

  revalidatePath("/settings");
  return apiKey;
}
