const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  stockqty: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  images: [
    {
      type: String,
    },
  ],
  desc: String,
  price: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
