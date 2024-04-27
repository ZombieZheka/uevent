const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotevn = require('dotenv');
const dbConnection = require("./config/database");
const runTests = require('./tests/index.test');

// dotenv setup
dotevn.config();
const root = path.resolve(__dirname);
process.env.MODELS = path.join(root, 'models/index');
process.env.PUBLIC_DIR = path.join(root, 'public');
// process.env.CONFIG = path.join(root, 'config/index');
process.env.SERVICES = path.join(root, 'services/index.service');
process.env.MIDDLEWARES = path.join(root, 'middlewares/index.middleware');
process.env.CONTROLLERS = path.join(root, 'controllers/index.controller');

console.log(` ${__filename} | PUBLIC_DIR=${process.env.PUBLIC_DIR}`);

// database setup
dbConnection();

const apiRouter = require('./routes/index.router');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.json({
    success: false,
    message: 'Page Not Found'
  });
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json(err);
});

if (process.env.NODE_ENV === 'test') {
  runTests();
}

module.exports = app;
