// server/tests/email.test.js

const {
  sendConfirmationCode,
  sendCongratulations,
  sendResetLink
} = require('../services/email.service');

const email = process.env.TEST_EMAIL;

async function sendConfirmationCodeTest() {
  await sendConfirmationCode(email, '12345678');
  return `check ${email} for confirmation code`;
}

async function sendCongratulationsTest() {
  await sendCongratulations(email);
  return `check ${email} for new letters`;
}

async function sendResetLinkTest() {
  await sendResetLink(email, 'https://google.com');
  return `check ${email} for reset link`;
}

module.exports = {
  sendConfirmationCodeTest,
  sendCongratulationsTest,
  sendResetLinkTest
}
