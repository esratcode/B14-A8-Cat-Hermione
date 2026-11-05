"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const API_URL = "http://localhost:5000";

const emptyCat = {
  name: "",
  image: "",
  description: "",
  age: "",
  status: "Available",
  color: "",
  gender: "",
};

// Get all cats (Public API)
async function getCats() {
  const response = await fetch(`${API_URL}/api/cats`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load cats");
  }

  return result.data;
}

export default function AdminPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCat, setNewCat] = useState(emptyCat);

  // Check login and load cats
  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    let active = true;

    async function loadCats() {
      try {
        setLoading(true);
        setError("");

        const data = await getCats();

        if (active) {
          setCats(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCats();

    return () => {
      active = false;
    };
  }, [isPending, session?.user, router]);

  // Add or Update Cat
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `${API_URL}/api/cats/${editingId}`
        : `${API_URL}/api/cats`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCat),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      const updatedCats = await getCats();

      setCats(updatedCats);
      setNewCat(emptyCat);
      setEditingId(null);
      setShowForm(false);

      alert(
        editingId ? "Cat updated successfully!" : "Cat added successfully!",
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Edit Cat
  const handleEdit = (cat) => {
    setNewCat({
      name: cat.name || "",
      image: cat.image || "",
      description: cat.description || "",
      age: cat.age || "",
      status: cat.status || "Available",
      color: cat.color || "",
      gender: cat.gender || "",
    });

    setEditingId(cat._id);
    setShowForm(true);
  };

  // Delete Cat
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this cat?",
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`${API_URL}/api/cats/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete cat");
      }

      setCats((previousCats) => previousCats.filter((cat) => cat._id !== id));

      if (editingId === id) {
        handleCancel();
      }

      alert("Cat deleted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  // Cancel Form
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setNewCat(emptyCat);
  };

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <p className="text-lg font-semibold text-orange-600">
          Checking login...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-orange-600">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your cats from one place.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Logged in as: {session.user.name || session.user.email}
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-white px-5 py-3 font-medium text-gray-700 shadow hover:text-orange-600"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Dashboard Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-gray-500">Total Cats</p>
            <h2 className="mt-2 text-3xl font-bold text-orange-600">
              {cats.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-gray-500">Available Cats</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {cats.filter((cat) => cat.status === "Available").length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-gray-500">Adopted Cats</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {cats.filter((cat) => cat.status === "Adopted").length}
            </h2>
          </div>
        </div>

        {/* Cat Management */}
        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6">
            <h2 className="text-xl font-bold text-gray-800">Cat Management</h2>

            <button
              onClick={() => {
                if (showForm) {
                  handleCancel();
                } else {
                  setNewCat(emptyCat);
                  setEditingId(null);
                  setShowForm(true);
                }
              }}
              className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              {showForm ? "Cancel" : "+ Add New Cat"}
            </button>
          </div>

          {/* Add / Edit Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 border-b bg-orange-50 p-6"
            >
              <h3 className="text-lg font-bold text-gray-800">
                {editingId ? "Edit Cat" : "Add a New Cat"}
              </h3>

              <input
                type="text"
                placeholder="Cat Name"
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-orange-500"
                required
              />

              <input
                type="text"
                placeholder="Image URL (e.g. /cats/cat4.jpg)"
                value={newCat.image}
                onChange={(e) =>
                  setNewCat({ ...newCat, image: e.target.value })
                }
                className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-orange-500"
                required
              />

              <textarea
                placeholder="Cat Description"
                value={newCat.description}
                onChange={(e) =>
                  setNewCat({ ...newCat, description: e.target.value })
                }
                className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-orange-500"
                rows="3"
              />

              <input
                type="text"
                placeholder="Age (e.g. 2 years)"
                value={newCat.age}
                onChange={(e) => setNewCat({ ...newCat, age: e.target.value })}
                className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-orange-500"
                required
              />

              <input
                type="text"
                placeholder="Color"
                value={newCat.color}
                onChange={(e) =>
                  setNewCat({ ...newCat, color: e.target.value })
                }
                className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-orange-500"
              />

              <select
                value={newCat.gender}
                onChange={(e) =>
                  setNewCat({ ...newCat, gender: e.target.value })
                }
                className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select
                value={newCat.status}
                onChange={(e) =>
                  setNewCat({ ...newCat, status: e.target.value })
                }
                className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="Available">Available</option>
                <option value="Adopted">Adopted</option>
              </select>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update Cat" : "Save Cat"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Cat Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-orange-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4">Cat</th>
                  <th className="px-6 py-4">Age</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      Loading cats...
                    </td>
                  </tr>
                ) : cats.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No cats available. Add your first cat!
                    </td>
                  </tr>
                ) : (
                  cats.map((cat) => (
                    <tr key={cat._id} className="border-t">
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {cat.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">{cat.age}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            cat.status === "Available"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {cat.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="rounded bg-blue-100 px-3 py-2 text-sm text-blue-600 hover:bg-blue-200"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="rounded bg-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Cat information is now loaded from MongoDB.
        </p>
      </div>
    </main>
  );
}
