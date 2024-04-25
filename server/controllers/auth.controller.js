// server/controllers/auth.controller.js

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  User
} = require(process.env.MODELS);
const {
  emailService
} = require(process.env.SERVICES);

module.exports = {
  /**
   * Creates new User.
   * Next should call login handler.
   * @param {Request} req request
   * @param {Response} res response
   * @param {Function} next next handler
   */
  register: async (req, res, next) => {
    const {
      firstName,
      secondName,
      email,
      password
    } = req.body;

    try {
      if (await User.findOne({ email })) {
        res.status(400);
        return res.json({
          success: false,
          message: 'Email is taken'
        });
      }

      await User.create({
        firstName,
        secondName,
        email,
        password
      });
      emailService.sendCongratulations(email, firstName);
    } catch (error) {
      console.error(error);
      res.status(500);
      return res.json({
        success: false,
        message: 'Register Error'
      });
    }
    // login handler
    next();
  },
  /**
   * Authorizes User
   * @param {Request} req request
   * @param {Response} res response
   */
  login: async (req, res) => {
    const {
      email,
      password
    } = req.body;

    try {
      const user = await User.findOne({ email });
      // searching user with specified email
      if (!user) {
        res.status(400);
        return res.json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      // comparing passwords
      if (!await bcryptjs.compare(password, user.password)) {
        res.status(401);
        return res.json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      // generating token
      const token = jwt.sign({
        id: user.id,
        firstName: user.firstName,
        secondName: user.secondName
      }, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d'
      });
      // saving token in cookies
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: true
      });
      // response about success
      res.status(200);
      return res.json({
        success: true,
        message: 'Logged in',
        user: user,
        token: token
      });
    } catch(error) {
      console.error(error);
      res.status(500);
      return res.json({
        success: false,
        message: 'Login Error'
      });
    }
  },
  /**
   * Unauthentificates User
   * @param {Response} res response
   * @returns 
   */
  logout: (res) => {
    res.clearCookie('authToken');
    res.status(200);
    return res.json({
      success: true,
      message: 'Logged out'
    });
  },
  /**
   * Sends reset link to User's email
   * @param {Request} req request
   * @param {Response} res response
   * @param {Function} next handler
   */
  generateResetLink: async (req, res, next) => {
    const {
      email
    } = req.params;

    res.status(501);
    res.json({
      success: true,
      message: 'NOT IMPLEMENTED: generateResetLink'
    });
  },
  /**
   * Changes User's password
   * @param {Request} req request
   * @param {Response} res response
   * @param {Function} next next handler
   */
  resetPassword: async (req, res, next) => {
    const { password } = req.body;
    const { resetToken } = req.params;

    res.send(501);
    res.json({
      success: true,
      message: 'NOT IMPLEMENTED: resetPassword'
    });
  }
};
