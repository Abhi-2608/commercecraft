const express = require("express");
const router = express.Router();
const Product = require("../../Model/product");
const verifyToken = require("../../middleware/auth");


router.post("/", verifyToken, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ msg: "Product created", product });
  } catch (err) {
    res.status(500).json({ msg: "Error creating product", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching products" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching product" });
  }
});

module.exports = router;



router.put("/:id", verifyToken, async (req, res) => {
    try {
      const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ msg: "Product not found" });
      res.json({ msg: "Product updated", product: updated });
    } catch (err) {
      res.status(500).json({ msg: "Error updating product", error: err.message });
    }
  });
  
  
  router.delete("/:id", verifyToken, async (req, res) => {
    try {
      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ msg: "Product not found" });
      res.json({ msg: "Product deleted" });
    } catch (err) {
      res.status(500).json({ msg: "Error deleting product", error: err.message });
    }
  });
  
