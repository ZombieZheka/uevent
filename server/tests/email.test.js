// server/tests/email.test.js

const {
  sendConfirmation,
  sendCongratulations,
  sendReset
} = require('../services/email.service');

const email = process.env.TEST_EMAIL;

async function sendConfirmationTest() {
  await sendConfirmation(email, '12345678');
  return `check ${email} for confirmation code`;
}

async function sendCongratulationsTest() {
  await sendCongratulations(email, 'Yevhen');
  return `check ${email} for new letters`;
}

async function sendResetTest() {
  await sendReset(email, 'https://google.com');
  return `check ${email} for reset link`;
}

module.exports = {
  sendConfirmationTest,
  sendCongratulationsTest,
  sendResetTest
}
