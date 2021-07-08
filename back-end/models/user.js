const mongoose = require('mongoose');
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  photo: {
    type: Buffer,
  },
  password: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  resetPassToken: String,
  resetPassTokenExpires: Date,
});


UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPassToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //console.log({ resetToken }, this.passwordResetToken);

  this.resetPassTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


const User = mongoose.model('User', UserSchema);

module.exports = User;
