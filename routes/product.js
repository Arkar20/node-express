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

//find one
router.get("/:id", async (req, res) => {
  const { data } = await Product.findById(req.params.id);
  res.json(data);
});

//update request

//delete request
router.delete("/", async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.body.id);
    console.log(result);
    return res.status(203).json({ msg: "Product Delete Success" });
  } catch (err) {
    return res.status(500).json({ err: "Server Error" });
  }
});
module.exports = router;
