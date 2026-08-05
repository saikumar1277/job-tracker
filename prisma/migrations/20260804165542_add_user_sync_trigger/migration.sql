-- Backfill: create a public.users row for every Supabase account that
-- already existed before this trigger was added (so accounts created
-- during earlier testing aren't left out).
INSERT INTO "users" ("id", "email")
SELECT id::text, email FROM auth.users
ON CONFLICT ("id") DO NOTHING;

-- Keeps "users" in sync going forward: every time Supabase inserts a row
-- into its own auth.users table (i.e. someone signs up), this function
-- runs automatically and creates a matching row here. SECURITY DEFINER
-- is required because our regular DB role can't normally react to changes
-- in the auth schema, which Supabase manages.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO "users" ("id", "email")
  VALUES (new.id::text, new.email);
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
