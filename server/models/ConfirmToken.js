// server/models/ConfirmToken.js

const {
  Schema,
  Types,
  model
} = require("mongoose");
const randToken = require('rand-token');

const ConfirmTokenShema = Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  token: {
    type: String,
    unique: true,
    default: () => randToken.generate(12)
  },
  expireAt: {
    type: Date,
    default: new Date(),
    expires: "24h",
  }
});

ConfirmTokenShema.methods.toJSON = () => {
  const { _id, __v, ... confirmToken } = this.toObject();
  return confirmToken;
};

module.exports = model("ConfirmToken", ConfirmTokenShema);
