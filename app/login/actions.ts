"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // TODO: call the Supabase method that checks an existing user's
  // email + password and starts a session if they match.
  // Docs: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
  //
  // It returns a `{ data, error }` object — if `error` is set, the
  // credentials were wrong (or something else went wrong). What should
  // happen in that case? (Hint: for now, throwing the error is fine —
  // we can build a nicer error message later.)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // TODO: call the Supabase method that creates a brand new user account
  // with this email + password.
  // Docs: https://supabase.com/docs/reference/javascript/auth-signup
  //
  // Same `{ data, error }` shape as login. Handle `error` the same way.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
