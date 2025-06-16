const express = require("express");
const router = express.Router();
const Product = require("../../Model/product");
const { verifyToken, isAdmin } = require("../../middleware/auth"); // ✅ updated import


router.post("/", verifyToken, isAdmin, async (req, res) => {
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
      const { category, priceMin, priceMax, search } = req.query;
  
      const filter = {};
  
      
      if (category) {
        filter.category = category;
      }
  
    
      if (priceMin || priceMax) {
        filter.price = {};
        if (priceMin) filter.price.$gte = Number(priceMin);
        if (priceMax) filter.price.$lte = Number(priceMax);
      }
  
     
      if (search) {
        filter.name = { $regex: search, $options: "i" };
      }
  
      const products = await Product.find(filter).sort({ createdAt: -1 });
      res.json(products);
    } catch (err) {
      res.status(500).json({ msg: "Error filtering products", error: err.message });
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


router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ msg: "Error updating product", error: err.message });
  }
});


router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting product", error: err.message });
  }
});

module.exports = router;
