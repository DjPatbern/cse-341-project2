require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger/swagger.json");
const carRoutes = require("./routes/carRoutes");
const manufacturerRoutes = require("./routes/manufacturerRoutes");

const app = express();
app.use(express.json());

// Ensure RENDER_URL exists at runtime
process.env.RENDER_URL = process.env.RENDER_URL || `http://localhost:${process.env.PORT || 8080}`;

// Update Swagger servers dynamically
swaggerDoc.servers = [
  {
    url: process.env.RENDER_URL,
    description: process.env.RENDER_URL.includes("localhost")
      ? "Local Development Server"
      : "Production Server (Render)"
  }
];

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routes
app.use("/cars", carRoutes);
app.use("/manufacturers", manufacturerRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

