const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config(); // Load .env first

const app = express();


connectDB();


app.use(cors());
app.use(express.json());


app.use("/api/auth", require("./config/routes/auth"));         // ✅ already present
app.use("/api/products", require("./config/routes/product"));  // ✅ add this line


app.get("/", (req, res) => {
  res.send("API is working ✅");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
