import { createBrowserClient } from "@supabase/ssr";

// For Client Components ("use client"). Safe to call on every render since
// it's cheap to construct — it doesn't open a connection by itself.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
