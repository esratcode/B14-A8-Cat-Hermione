
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 bg-white px-8 py-5 shadow-sm">
      <Link href="/" className="text-2xl font-bold text-orange-600">
        🐱 Cat Hermione
      </Link>

      <div className="flex flex-wrap items-center gap-5 font-medium">
        <Link href="/">Home</Link>
        <a href="/#about">About</a>
        <a href="/#cats">Cats</a>
        <a href="/#contact">Contact</a>

        {session?.user ? (
          <>
            <span className="font-semibold text-orange-600">
              Hi, {session.user.name}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-full bg-red-500 px-5 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>

            <Link
              href="/signup"
              className="rounded-full bg-orange-500 px-5 py-2 text-white hover:bg-orange-600"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
