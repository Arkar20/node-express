const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
  product: {
    type: Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
});

OrderItemSchema.virtual("id", () => this._id.toHexString());

OrderItemSchema.set("toJSON", { virtuals: true });
exports.OrderItem = mongoose.model("OrderItem", OrderItemSchema);
