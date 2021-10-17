const mongoose = require("mongoose");
const { Schema } = mongoose;
const { OrderItem } = require("./orderitems");
const orderSchema = new Schema({
  orderitems: [
    {
      type: Schema.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  user: {
    type: Schema.ObjectId,
    require: true,
    ref: "User",
  },
  shippingaddress: {
    type: String,
    requried: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});
orderSchema.virtual("id", () => this._id.toHexString());

orderSchema.set("toJSON", { virtuals: true });
exports.Order = mongoose.model("Order", orderSchema);
