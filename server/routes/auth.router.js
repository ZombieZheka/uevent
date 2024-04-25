// server/routes/auth.router.js

const express = require('express');
const router = express.Router();

const { auth } = require(process.env.CONTROLLERS);

// register
router.post(
    '/register',
    [
        // check('name', 'Name is required').not().isEmpty(),
        // check('name', 'Name length must be max 32 characters').isLength({max: 32}),
        // check("email", "Invalid email").isEmail(),
        // check("password", "Password is required").not().isEmpty(),
        // check('password', 'Password should be between 8-32 characters').isLength({min: 8, max: 32}),
        // check('password', 'Password should include number, symbol, lowercase and uppercase letter').isStrongPassword(),
        // validateFields,
        // emailExists
    ],
    auth.register,
    auth.login
);

// login
router.post(
    '/login',
    [
        // check("email", "Invalid email").isEmail(),
        // check("password", "Password is required").not().isEmpty(),
        // validateFields
    ],
    auth.login
);

// logout
router.post('/logout', auth.logout);

module.exports = router;
