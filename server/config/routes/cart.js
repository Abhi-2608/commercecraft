const express = require("express");
const router = express.Router();
const Cart = require("../../Model/cart");
const Product = require("../../Model/product");
const { verifyToken } = require("../../middleware/auth");

// Add product to cart
router.post("/", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json({ msg: "Item added to cart", cart });
  } catch (err) {
    res.status(500).json({ msg: "Error adding to cart", error: err.message });
  }
});

// Get user's cart
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");
    res.json(cart || { userId: req.user.userId, items: [] });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching cart", error: err.message });
  }
});

// Remove item from cart
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();

    res.json({ msg: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ msg: "Error removing item", error: err.message });
  }
});

module.exports = router;
