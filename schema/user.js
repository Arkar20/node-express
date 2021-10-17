const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
UserSchema.virtual("id", () => this._id.toHexString());

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
