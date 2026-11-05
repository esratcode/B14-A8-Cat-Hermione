
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (result.error) {
        setMessage(
          result.error.message || "Signup failed. Please try again."
        );
        setMessageType("error");
        return;
      }

      setMessage("Account created successfully!");
      setMessageType("success");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Signup error:", error);

      setMessage(
        "Server connection failed. Please try again later."
      );
      setMessageType("error");
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
            Create Account
          </h2>

          <p className="mt-2 text-gray-500">
            Join our lovely cat community!
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              required
            />
          </div>

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
              placeholder="Create a password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              required
              minLength={8}
            />

            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters.
            </p>
          </div>

          {message && (
            <p
              role="alert"
              className={`rounded-lg p-3 text-center text-sm ${
                messageType === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-orange-600 hover:underline"
          >
            Login
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
