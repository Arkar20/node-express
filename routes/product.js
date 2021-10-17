const express = require("express");
const router = express.Router();

const Product = require("../schema/product.js");

//register request
router.post("/", async (req, res) => {
  const { name, stockqty, price, desc, category } = req.body;
  let data = { name, stockqty, price, desc, category };

  const product = new Product(data);
  try {
    const result = await product.save();
    return res.json(result);
  } catch (err) {
    res.json(err);
  }
});

//get all request
router.get("", async (req, res) => {
  try {
    // console.log(req.query);

    const { category } = req.query;
    console.log();
    const result = await Product.find(req.query);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err });
  }
});
//product counts
router.get("/counts", async (req, res) => {
  try {
    const result = await Product.countDocuments();
    return res.status(202).json({ productCount: result });
  } catch (err) {
    return res.status(500).json({ err, msg: "No Products Yet" });
  }
});
//features products
router.get("/features", async (req, res) => {
  try {
    const result = await Product.find({ isFeatured: true });

    res.json({ result });
  } catch (err) {
    res.status(500).json({ err, msg: err.message });
  }
});
//features products by count
router.get("/features/:count", async (req, res) => {
  try {
    const { count } = req.params;

    const result = count
      ? await Product.find({ isFeatured: true }).limit(count) //+count to convert the count into number
      : await Product.find({ isFeatured: true });

    res.json({ result });
  } catch (err) {
    res.status(500).json({ err, msg: err.message });
  }
});

//find one
router.get("/:id", async (req, res) => {
  try {
    const result = await Product.findById(req.params.id);

    return res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "product not found" });
  }
});

//update request
router.put("/:id", async (req, res) => {
  const { name, stockqty, price, desc, isFeatured } = req.body;
  let data = { name, stockqty, price, desc, isFeatured };

  try {
    const result = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err, msg: "product not found" });
  }
});

//delete request
router.delete("/:id", async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);

    return res.status(203).json({ msg: "Product Delete Success" });
  } catch (err) {
    return res.status(500).json({ err: "Server Error" });
  }
});

async function filteredProducts(queryString) {
  console.log(queryString);
  return await Product.find(queryString);
}
module.exports = router;
