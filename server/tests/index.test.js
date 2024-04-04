// server/tests/index.test.js

const fs = require('fs');
require('dotenv').config();
const path = require('path');
const basename = path.basename(__filename);

// const email = require('../services/email.service');

const tests = {};

fs.readdirSync(__dirname)
.filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') !== -1
  );
})
.forEach(file => {
  const test = require(path.join(__dirname, file));
  const name = file.replace('.test.js', '');
  tests[name] = test;
});

const delimiter = '------------------------------------------------------------';

/**
 * Runs through all exported tests in /tests folder.
 */
async function runTests() {
  // const mailOptions = {
  //   from: process.env.EMAIL,
  //   to: process.env.TEST_EMAIL,
  //   subject: 'Congratulations',
  //   text: 'Thank you for registration in Uevent!',
  // };
  // console.log(`EMAIL: ${process.env.EMAIL}`);
  // console.log(`EMAIL_APP_CODE: ${process.env.EMAIL_APP_CODE}`);
  // console.log(`EMAIL_APP_CODE: ${process.env.TEST_EMAIL}`);
  // await email.sendEmail(mailOptions);

  console.log(delimiter);

  for (const moduleName in tests) {
    const moduleTests = tests[moduleName];
    console.log(`Running tests from ${moduleName} module:`);
    console.log(delimiter);
    for (const testName in moduleTests) {
      const testFunction = moduleTests[testName];
      const testResult = await testFunction(); // Викликаємо функцію тесту
      console.log(` ${testName} |`, testResult);
    }
    console.log(delimiter);
  }
}

runTests();
