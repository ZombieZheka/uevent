// server/tests/user.test.js

const {
  User
} = require('../models/index');

async function createUserTest() {
  return await User.create({
    firstName: 'Petro',
    secondName: 'Poroshenko',
    email: 'poroshenko@gmail.com',
    password: 'secret_password'
  });
}

module.exports = {
  // createUserTest
}
