// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://cat-hermione-client-teal.vercel.app",
      "https://cat-hermione-client111-q0k3emuse-dev-stack-builder2.vercel.app",
    ],
    credentials: true,
  }),
);