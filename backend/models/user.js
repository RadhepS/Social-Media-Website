const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
//const idValidator = require("mongoose-id-validator");

mongoose.set("useCreateIndex", true);

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

userSchema.plugin(uniqueValidator);
//userSchema.plugin(idValidator, followers, following); - Test afer

module.exports = mongoose.model("User", userSchema);
