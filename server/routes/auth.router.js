// server/routes/auth.router.js

const { check } = require('express-validator');
const express = require('express');
const router = express.Router();

const { auth } = require(process.env.CONTROLLERS);

// register
router.post(
  '/register',
  [
    check('firstName', "First Name is required").not().isEmpty(),
    check('firstName', "First Name length must be max 32 characters").isLength({max: 32}),
    check('secondName', "Second Name is required").not().isEmpty(),
    check('secondName', "Second Name length must be max 32 characters").isLength({max: 32}),
    check('email', "Invalid email").isEmail(),
    check('password', "Password is required").not().isEmpty(),
    check('password', "Password should be between 8-32 characters").isLength({min: 8, max: 32}),
    check('password', "Password should include number, symbol, lowercase and uppercase letter").isStrongPassword(),
  ],
  auth.register,
  auth.sendConfirmEmail
);

// send-confirm
router.post(
  '/send-confirm',
  auth.sendConfirmEmail
);

// send-confirm
router.get(
  '/confirm/:token',
  auth.confirmEmail
);

// login
router.post(
  '/login',
  [
    check('email', "Invalid email").isEmail(),
    check('password', "Password is required").not().isEmpty(),
  ],
  auth.login
);

// logout
router.post(
  '/logout',
  auth.logout
);

module.exports = router;
