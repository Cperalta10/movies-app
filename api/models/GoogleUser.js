const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    userName: { type: String },
  },
  { timestamps: true }
);

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("GoogleUser", UserSchema);
