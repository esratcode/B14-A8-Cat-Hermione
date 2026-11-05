const { db } = require("./db");

const authPromise = (async () => {
  const { betterAuth } = await import("better-auth");
  const { mongodbAdapter } = await import("better-auth/adapters/mongodb");

  return betterAuth({
    database: mongodbAdapter(db),

    trustedOrigins: [
      "http://localhost:3000",
      "https://cat-hermione-client111-q0k3emuse-dev-stack-builder2.vercel.app",
    ],

    emailAndPassword: {
      enabled: true,
    },

    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
  });
})();

module.exports = authPromise;
