// server/tests/index.test.js

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

// const {
  // User,
  // ResetToken
// } = require(process.env.MODELS);

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
  // await User.collection.drop();
  // await ResetToken.collection.drop();

  console.log(delimiter);
  for (const moduleName in tests) {
    const moduleTests = tests[moduleName];
    console.log(`Running tests from ${moduleName} module:`);
    console.log(delimiter);
    for (const testName in moduleTests) {
      const testFunction = moduleTests[testName];
      const testResult = await testFunction();
      console.log(` ${testName} |`, testResult);
    }
    console.log(delimiter);
  }
}

// runTests();

module.exports = runTests;
