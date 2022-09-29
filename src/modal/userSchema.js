const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  housename: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
