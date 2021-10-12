const express = require("express");
const router = express.Router();

const Product = require("../schema/product.js");

//register request
router.post("/create", async (req, res) => {
  const { name, stockqty, price, desc } = req.body;
  let data = { name, stockqty, price, desc };

  const product = new Product(data);
  try {
    const result = await product.save();
    return res.json(result);
  } catch (err) {
    res.json(err);
  }
});

//get all request
router.get("/", async (req, res) => {
  try {
    const result = await Product.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err });
  }
});

//update request

//delete request

module.exports = router;
