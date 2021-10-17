const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});
CategorySchema.virtual("id", function () {
  return this._id.toHexString();
});
CategorySchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Category", CategorySchema);
