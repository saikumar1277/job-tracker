import { signOut } from "./actions";

export default function Signout() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-gray-500 hover:text-gray-500 cursor-pointer"
      >
        Sign out
      </button>
    </form>
  );
}
