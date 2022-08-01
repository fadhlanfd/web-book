const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  profileName: {type: String, require: true},
  address: {type: String, require: true}
  },
  { collection: "users"}
);

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model
