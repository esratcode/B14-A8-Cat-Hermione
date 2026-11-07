import AdoptButton from "../../components/AdoptButton";
import Link from "next/link";

const API_URL = "https://b14-a8-cat-hermione.vercel.app";

export default async function CatDetails({ params }) {
  const { id } = await params;

  let cat = null;

  try {
    const response = await fetch(`${API_URL}/api/cats`, {
      cache: "no-store",
    });

    const result = await response.json();

    if (result.success) {
      cat = result.data.find(
        (item) => item.name.toLowerCase() === id.toLowerCase(),
      );
    }
  } catch (error) {
    console.error("Failed to fetch cat:", error);
  }

  if (!cat) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Cat Not Found!</h1>

          <Link
            href="/"
            className="mt-5 inline-block text-orange-600 underline"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-lg md:p-10">
        <Link
          href="/"
          className="font-semibold text-orange-600 hover:underline"
        >
          ← Back to Home
        </Link>

        <div className="mt-8 grid items-center gap-8 md:grid-cols-2">
          <img
            src={cat.image.startsWith("/") ? cat.image : `/${cat.image}`}
            alt={cat.name}
            className="h-80 w-full rounded-xl object-cover"
          />

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Meet {cat.name} 🐱
            </h1>

            <p className="mt-4 text-gray-600">{cat.description}</p>

            <div className="mt-6 space-y-3 text-gray-700">
              <p>
                <strong>Age:</strong> {cat.age}
              </p>

              <p>
                <strong>Color:</strong> {cat.color}
              </p>

              <p>
                <strong>Gender:</strong> {cat.gender}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    cat.status === "Available"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {cat.status}
                </span>
              </p>
            </div>

            <AdoptButton
              key={cat._id.toString()}
              catId={cat._id.toString()}
              catName={cat.name}
              initialStatus={cat.status}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
