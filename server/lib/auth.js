const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");
const { db } = require("./db");

const auth = betterAuth({
  database: mongodbAdapter(db),

  // Allow requests from Next.js frontend
  trustedOrigins: ["http://localhost:3000"],

  emailAndPassword: {
    enabled: true,
  },

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
});

module.exports = auth;
