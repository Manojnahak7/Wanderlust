const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  username: {
    type: String,
    required: true,
    unique: true, 
  },
  image: {
    type: String, 
  },
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email", 
});

module.exports = mongoose.model("User", userSchema);
