import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/dal";
import ApiKeyCard from "@/app/settings/api-key-card";

export default async function SettingsPage() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { apiKey: true },
  });

  return (
    <main className="mx-auto max-w-2xl space-y-6 py-10">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <ApiKeyCard initialKey={dbUser?.apiKey ?? null} />
    </main>
  );
}
