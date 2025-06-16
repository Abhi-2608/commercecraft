const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../Model/user");
const { verifyToken } = require("../../middleware/auth"); // ✅ Fix import

console.log(" USER VALUE IS:", User);

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
    console.error(" Register Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ msg: "No account found with this email" });
    }

    const passwordMatched = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatched) {
      return res.status(401).json({ msg: "Incorrect password" });
    }

    const payload = {
      userId: existingUser._id,
      role: existingUser.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Server error during login" });
  }
});

console.log("🧪 verifyToken is a", typeof verifyToken); 
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    msg: "Welcome to your profile!",
    user: req.user,
  });
});

module.exports = router; 
