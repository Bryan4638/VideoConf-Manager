import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import techniciansRoutes from "./routes/technicians";
import locationsRoutes from "./routes/locations";
import conferencesRoutes from "./routes/conferences";
import { errorHandler } from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/technicians", techniciansRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/conferences", conferencesRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/me`);
  console.log(`   - CRUD /api/technicians`);
  console.log(`   - CRUD /api/locations`);
  console.log(`   - CRUD /api/conferences`);
});

export default app;
