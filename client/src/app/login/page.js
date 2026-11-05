
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (result.error) {
        setMessage(
          result.error.message ||
            "Login failed. Please check your email and password."
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        "Server connection failed. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-orange-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-orange-600">
            🐱 Cat Hermione
          </h1>

          <h2 className="mt-5 text-2xl font-bold text-gray-800">
            Welcome Back!
          </h2>

          <p className="mt-2 text-gray-500">
            Login to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              required
            />
          </div>

          {message && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-orange-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-orange-600"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
