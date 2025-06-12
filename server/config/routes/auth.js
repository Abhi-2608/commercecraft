const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../Model/user"); 
console.log("✅ USER TYPE IS:", typeof User);


const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ msg: "User registered successfully" });

  } catch (err) {
    console.error("❌ Register Error:", err); // Add this for full error output
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
