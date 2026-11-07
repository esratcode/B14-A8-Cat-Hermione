require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");

const betterAuthNode = import("better-auth/node");
const authPromise = require("./lib/auth");
const { client, db } = require("./lib/db");

const app = express();

const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://cat-hermione-client-teal.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());

let catsCollection;
let dbInitialization;

// Initialize MongoDB
async function initializeDB() {
  if (!dbInitialization) {
    dbInitialization = (async () => {
      await client.connect();

      catsCollection = db.collection("cats");

      console.log("MongoDB connected successfully!");

      // Add sample cats only if collection is empty
      const count = await catsCollection.countDocuments();

      if (count === 0) {
        await catsCollection.insertMany([
          {
            name: "Milo",
            image: "/cats/cat1.jpg",
            description: "A cute and playful orange cat.",
            age: "2 years",
            status: "Available",
            color: "Orange",
            gender: "Male",
            createdAt: new Date(),
          },
          {
            name: "Luna",
            image: "/cats/cat2.jpg",
            description: "A lovely and gentle white cat.",
            age: "1 year",
            status: "Available",
            color: "White",
            gender: "Female",
            createdAt: new Date(),
          },
          {
            name: "Oliver",
            image: "/cats/cat3.jpg",
            description: "A friendly and adorable grey cat.",
            age: "3 years",
            status: "Adopted",
            color: "Grey",
            gender: "Male",
            createdAt: new Date(),
          },
        ]);

        console.log("Sample cats added successfully!");
      }
    })().catch((error) => {
      dbInitialization = null;
      throw error;
    });
  }

  return dbInitialization;
}

// Ensure MongoDB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await initializeDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Better Auth Route
app.all("/api/auth/*splat", async (req, res, next) => {
  try {
    const [{ toNodeHandler }, auth] = await Promise.all([
      betterAuthNode,
      authPromise,
    ]);

    return toNodeHandler(auth)(req, res, next);
  } catch (error) {
    console.error("Better Auth route error:", error);
    next(error);
  }
});

// Authentication Middleware
async function requireAuth(req, res, next) {
  try {
    const [{ fromNodeHeaders }, auth] = await Promise.all([
      betterAuthNode,
      authPromise,
    ]);

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    req.user = session.user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
}

// Home Route
app.get("/", (req, res) => {
  res.send("Cat-Hermione server is running!");
});

// Health Route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running!",
  });
});

// Get All Cats (Public)
app.get("/api/cats", async (req, res) => {
  try {
    const cats = await catsCollection.find().sort({ createdAt: -1 }).toArray();

    res.json({
      success: true,
      data: cats,
    });
  } catch (error) {
    console.error("Fetch cats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cats",
    });
  }
});

// Get Single Cat (Public)
app.get("/api/cats/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cat ID",
      });
    }

    const cat = await catsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!cat) {
      return res.status(404).json({
        success: false,
        message: "Cat not found",
      });
    }

    res.json({
      success: true,
      data: cat,
    });
  } catch (error) {
    console.error("Fetch single cat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cat",
    });
  }
});

// Create Cat (Login Required)
app.post("/api/cats", requireAuth, async (req, res) => {
  try {
    const { name, image, description, age, status, color, gender } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: "Name and image are required",
      });
    }

    const newCat = {
      name,
      image,
      description: description || "",
      age: age || "",
      status: status || "Available",
      color: color || "",
      gender: gender || "",
      createdAt: new Date(),
    };

    const result = await catsCollection.insertOne(newCat);

    res.status(201).json({
      success: true,
      message: "Cat created successfully",
      data: {
        ...newCat,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error("Create cat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create cat",
    });
  }
});

// Update Cat (Login Required)
app.put("/api/cats/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cat ID",
      });
    }

    const { name, image, description, age, status, color, gender } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: "Name and image are required",
      });
    }

    const result = await catsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          image,
          description: description || "",
          age: age || "",
          status: status || "Available",
          color: color || "",
          gender: gender || "",
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Cat not found",
      });
    }

    res.json({
      success: true,
      message: "Cat updated successfully",
    });
  } catch (error) {
    console.error("Update cat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cat",
    });
  }
});

// Adopt Cat (Login Required)
app.patch("/api/cats/:id/adopt", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cat ID",
      });
    }

    const result = await catsCollection.updateOne(
      {
        _id: new ObjectId(id),
        status: "Available",
      },
      {
        $set: {
          status: "Adopted",
          adoptedBy: req.user.id,
          adoptedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Cat is already adopted or unavailable",
      });
    }

    res.json({
      success: true,
      message: "Cat adopted successfully!",
    });
  } catch (error) {
    console.error("Adopt cat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to adopt cat",
    });
  }
});

// Delete Cat (Login Required)
app.delete("/api/cats/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cat ID",
      });
    }

    const result = await catsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Cat not found",
      });
    }

    res.json({
      success: true,
      message: "Cat deleted successfully",
    });
  } catch (error) {
    console.error("Delete cat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete cat",
    });
  }
});

// Export Express app for Vercel
module.exports = app;

// Start server locally only
if (require.main === module) {
  initializeDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error);
      process.exit(1);
    });
}
