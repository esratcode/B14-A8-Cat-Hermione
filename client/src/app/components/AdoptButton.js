"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdoptButton({ catId, catName, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isAdopted = status === "Adopted";

  const handleAdopt = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/cats/${catId}/adopt`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (response.status === 401) {
        setMessage("Please login first to adopt this cat.");
        return;
      }

      if (!response.ok) {
        setMessage(result.message || "Adoption failed!");
        return;
      }

      setStatus("Adopted");
      setMessage(`${catName} adopted successfully! 🐱`);
    } catch (error) {
      console.error("Adoption error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      {isAdopted ? (
        <p className="font-semibold text-red-600">
          This cat has already been adopted.
        </p>
      ) : (
        <button
          onClick={handleAdopt}
          disabled={loading}
          className="rounded-full bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "Adopting..." : `Adopt Now - ${catName}`}
        </button>
      )}

      {message && <p className="mt-3 font-medium text-orange-700">{message}</p>}

      {message.includes("login") && (
        <Link
          href="/login"
          className="mt-2 inline-block font-semibold text-orange-600 underline"
        >
          Go to Login
        </Link>
      )}
    </div>
  );
}
