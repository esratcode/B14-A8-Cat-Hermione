
import Link from "next/link";
import Navbar from "./components/Navbar";

const cats = [
  {
    name: "Milo",
    image: "/cats/cat1.jpg",
    description: "A cute and playful orange cat.",
  },
  {
    name: "Luna",
    image: "/cats/cat2.jpg",
    description: "A lovely and gentle white cat.",
  },
  {
    name: "Oliver",
    image: "/cats/cat3.jpg",
    description: "A friendly and adorable grey cat.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-orange-50 text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-lg font-semibold text-orange-600">
          Welcome to Cat Hermione
        </p>

        <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Find Your New Best Friend
        </h2>

        <p className="mt-6 max-w-xl text-gray-600">
          Give a lovely cat a safe and happy home. Explore our cats and find
          your perfect companion.
        </p>

        <a
          href="#cats"
          className="mt-8 rounded-full bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Explore Cats
        </a>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white px-6 py-16 text-center">
        <h2 className="text-3xl font-bold">About Cat Hermione</h2>

        <p className="mx-auto mt-5 max-w-2xl text-gray-600">
          Cat Hermione is a platform dedicated to helping cats find loving
          homes. We believe every cat deserves care, kindness, and a happy
          family.
        </p>
      </section>

      {/* Cats Section */}
      <section id="cats" className="px-6 py-16 text-center">
        <h2 className="text-3xl font-bold">Meet Our Cats</h2>

        <p className="mt-3 text-gray-600">
          Find a lovely companion for your family.
        </p>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          {cats.map((cat) => (
            <div
              key={cat.name}
              className="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-lg"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold">{cat.name}</h3>

                <p className="mt-2 text-gray-600">
                  {cat.description}
                </p>

                <Link
                  href={`/cats/${cat.name.toLowerCase()}`}
                  className="mt-5 inline-block rounded-full bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
                >
                  Adopt Me
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white px-6 py-16 text-center">
        <h2 className="text-3xl font-bold">Contact Us</h2>

        <p className="mt-4 text-gray-600">
          Have questions about adopting a cat? Get in touch with us.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-6 text-center text-white">
        <p>© 2026 Cat Hermione. All rights reserved.</p>
      </footer>
    </main>
  );
}
