const express = require("express");
const router = express.Router();
const Order = require("../../Model/order");
const Cart = require("../../Model/cart");
const { verifyToken } = require("../../middleware/auth");

// Place order from cart
router.post("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    const items = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity
    }));

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    const order = new Order({
      userId: req.user.userId,
      items,
      totalAmount
    });

    await order.save();
    await Cart.findOneAndDelete({ userId: req.user.userId }); // Clear cart

    res.status(201).json({ msg: "Order placed", order });

  } catch (err) {
    res.status(500).json({ msg: "Error placing order", error: err.message });
  }
});

// View order history
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).populate("items.productId").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders", error: err.message });
  }
});

module.exports = router;
