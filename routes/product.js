const express = require("express");
const router = express.Router();

const Product = require("../schema/product.js");

router.post("/create", async (req, res) => {
  const { name } = req.body;
  const product = new Product({ name });
  try {
    const result = await product.save();
    return res.json(result);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
