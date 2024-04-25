// server/models/ResetToken.js

const {
  Schema,
  Types,
  model
} = require("mongoose");
const randToken = require('rand-token');

const ResetTokenShema = Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  token: {
    type: String,
    unique: true,
    default: () => randToken.generate(20)
  },
  expireAt: {
    type: Date,
    default: new Date(),
    expires: "3h",
  }
});

ResetTokenShema.methods.toJSON = () => {
  const { _id, __v, ...resetToken } = this.toObject();
  return resetToken;
};

module.exports = model("ResetToken", ResetTokenShema);
