const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const Category = require("../schema/category");

router.post("/", async (req, res) => {
  const { name } = req.body;
  //   console.log(req);
  try {
    const category = new Category({ name });
    const result = await category.save();
    res.json({ result });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("", async (req, res) => {
  try {
    const result = await Category.find().select("id name");

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete routes
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    return res.send("Category Delete Successfully");
  } catch (err) {
    return res.json(err);
  }
});

//update router
router.put("/:id", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await Category.findByIdAndUpdate(req.params.id, {
      name,
    });
    res.status(202).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
