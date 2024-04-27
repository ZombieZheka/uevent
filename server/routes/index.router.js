// server/routes/index.router.js

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const express = require('express');
const router = express.Router();

const paymentRouter = require('./payment.router');

router.use('/payment', paymentRouter);

fs.readdirSync(__dirname)
.filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.router.js') !== -1
  );
})
.forEach(file => {
  const subrouter = require(path.join(__dirname, file));
  const route = file.replace('.router.js', '');
  router.use(`/${route}`, subrouter);
});

module.exports = router;
