const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schema/user");

router.get("/", async (req, res) => {
  try {
    const results = await User.find({}).select("-password");
    res.status(202).json(results);
  } catch (err) {
    res.send("Something went wrong. Please try again");
  }
});
router.get("/:id", async (req, res) => {
  try {
    const results = await User.findById(req.params.id).select("-password");
    res.status(202).json(results);
  } catch (err) {
    res.send("Something went wrong. Please try again");
  }
});

router.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHashed = bcrypt.hashSync(password, 12);
  //validation middleware
  const userInDB = await User.findOne({ email }).catch((err) => res.json(err));
  if (userInDB) return res.json({ msg: "Email Already Exits" });

  const user = new User({
    name,
    email,
    password: passwordHashed,
  });
  const saveResult = await user.save().catch((err) => {
    res.json(err);
  });

  if (!saveResult) res.status(500).json({ msg: "Something Went Wrong!" });

  res.status(200).json(saveResult);
});

//delete route

//update route

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(500).json({ msg: "User not Found" });

  const passwordMatch = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordMatch) return res.json({ err: "Password Do not match!" });

  const token = await jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });

  return res.json({ token, user });
});

module.exports = router;
