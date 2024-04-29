// server/tests/resetToken.test.js

const {
  User,
  ResetToken
} = require('../models/index');

async function createResetTokenTest() {
  const user = await User.create({
    firstName: 'Reset',
    secondName: 'Token',
    email: 'reset@test.com',
    password: 'secret_password'
  });
  const resetToken = await ResetToken.create({
    user: user
  });
  return resetToken;
}

module.exports = {
  // createResetTokenTest
}
