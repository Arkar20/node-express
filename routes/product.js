const express = require("express");
const router = express.Router();

const Product = require("../schema/product.js");

//multer for file uploads
const multer = require("multer");

const filepath = "public/uploads";

const Allow_IMG_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
//for file uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const extension = Allow_IMG_TYPE[file.mimetype];
    var error = new Error("IMG type invalid");
    if (extension) error = null;
    cb(error, filepath);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(" ", "-");
    const extension = Allow_IMG_TYPE[file.mimetype];

    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
const upload = multer({ storage: storage });

//register request
router.post("/", upload.single("image"), async (req, res) => {
  const { name, stockqty, price, desc, category, image } = req.body;
  const imgname = req.file?.filename;
  const basePath = `${req.protocol}://${req.get("host")}/${filepath}/`;
  let data = {
    name,
    stockqty,
    price,
    desc,
    category,
    image: req.file ? basePath + imgname : undefined,
  };

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
router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, stockqty, price, desc, isFeatured } = req.body;

  const imgname = req.file?.filename;
  const basePath = `${req.protocol}://${req.get("host")}/${filepath}/`;

  let data = {
    name,
    stockqty,
    price,
    desc,
    isFeatured,
    image: req.file ? basePath + imgname : undefined,
  };

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

//multiple products images
router.put(
  "/galllary-images/:id",
  upload.array("images", 10),
  async (req, res) => {
    try {
      const basePath = `${req.protocol}://${req.get("host")}/`;

      const data = req.files;

      const imagesArray =
        data.length != 0 ? data.map((image) => `${basePath}${image.path}`) : [];

      console.log(imagesArray);

      if (imagesArray.length == 0) {
        return res.json({ msg: "No images To Upload" });
      }
      const productUpdate = await Product.findByIdAndUpdate(
        req.params.id,
        { galllaryimages: imagesArray },
        { new: true }
      ).catch((err) => res.json({ msg: err.message }));

      return res.status(203).json(productUpdate);
    } catch (err) {
      return res.status(500).json({ err, msg: "Product Not Found!" });
    }
  }
);
module.exports = router;
