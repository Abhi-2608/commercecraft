const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config(); // Load .env first

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./config/routes/auth"));
app.use("/api/products", require("./config/routes/product"));
app.use("/api/cart", require("./config/routes/cart")); 

// Test route
app.get("/", (req, res) => {
  res.send("API is working ");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
