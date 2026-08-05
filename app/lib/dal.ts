import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

// `cache()` means if multiple things on the same page call this during one
// request (e.g. the page itself, plus a layout), Supabase only gets hit
// once instead of once per caller.
export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
});

// Use this anywhere a page/action should be off-limits to logged-out
// visitors. Centralizing the redirect here means every caller behaves the
// same way instead of each one remembering to check + redirect itself.
export async function requireUser() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
