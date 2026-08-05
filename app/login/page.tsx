import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-6 text-2xl font-semibold">Job Applications</h1>

      {/* One form, two submit buttons. Each <button formAction={...}> tells
          the browser which Server Action to call for THAT button, instead of
          needing two separate <form> elements. */}
      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <div className="flex gap-2">
          <Button formAction={login} type="submit">
            Log in
          </Button>
          <Button formAction={signup} type="submit" variant="outline">
            Sign up
          </Button>
        </div>
      </form>
    </main>
  );
}
