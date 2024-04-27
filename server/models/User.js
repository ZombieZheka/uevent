// server/models/User.js

const {
  Schema,
  Types,
  model
} = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require("bcryptjs");
const path = require('path');
const fs = require('fs');

// const default_image_path = `${process.env.PUBLIC_DIR}/images/default_user.jpg`;
// const default_image_path = `${path.resolve('.')}/public/images/default_user.jpg`;

const UserSchema = Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  secondName: {
    type: String,
    required: [true, "Second Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    unique: true,
  },
  image: {
    data: Buffer,
    contentType: String,
    // default: {
    //   data: fs.readFileSync(default_image_path),
    //   contentType: "image/png"
    // }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  }
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified('password') || !user.image) {
    return next();
  }

  const salt = await bcryptjs.genSalt(process.env.BCRYPT_SALT || 10);
  user.password = await bcryptjs.hash(user.password, salt);
  next();
});

UserSchema.methods.toJSON = function() {
  const { _id, __v, password, ...user } = this.toObject();
  return user;
};

module.exports = model("User", UserSchema);
