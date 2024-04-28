// server/controllers/auth.controller.js

const randToken = require('rand-token');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  User,
  ConfirmToken,
  ResetToken
} = require(process.env.MODELS);
const {
  emailService
} = require(process.env.SERVICES);

module.exports = {
  /**
   * Creates new User.
   * @param {Request} req request
   * @param {Response} res response
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

      const user = await User.create({
        firstName,
        secondName,
        email,
        password
      });
      req.user = user;
    } catch (error) {
      console.error(error);
      res.status(500);
      return res.json({
        success: false,
        message: 'Register Error'
      });
    }
    // sendConfirmEmail handler
    next();
  },
  /**
   * Sends confirmation email
   * @param {Request} req request
   * @param {Response} res response
   * @returns 
   */
  sendConfirmEmail: async (req, res) => {
    const {
      email
    } = req.body;

    try {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3812';

      const user = await User.findOne({ email: email });
      const confirmToken = await ConfirmToken.create({ user: user });
      const link = `${baseUrl}/api/auth/confirm/${confirmToken.token}`;
      
      await emailService.sendConfirmation(email, link);
      res.status(200);
      return res.json({
        success: true,
        message: 'Confirmation letter sent'
      });
    } catch (error) {
      console.error(error);
      res.status(500);
      return res.json({
        success: false,
        message: 'Send confirmation letter Error'
      });
    }
  },
  /**
   * Confirms users's email.
   * Next should call login handler.
   * @param {Request} req request
   * @param {Response} res response
   * @param {Function} next next handler
   */
  confirmEmail: async (req, res, next) => {
    const {
      token
    } = req.params;

    try {
      const confirmToken = await ConfirmToken.findOne({ token: token });
      if (!confirmToken) {
        res.status(404);
        return res.json({
          success: false,
          message: 'Token expired'
        });
      }
      const user = await User.findById(confirmToken.user);
      user.emailConfirmed = true;
      await user.save();
      ConfirmToken.deleteOne({ token: token });

      await emailService.sendCongratulations(user.email, user.firstName);

      res.status(200);
      return res.json({
        success: true,
        message: 'Email confirmed'
      });
    } catch (error) {
      console.error(error);
      res.status(500);
      return res.json({
        success: false,
        message: 'Confirm Email Error'
      });
    }
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
      // checking if email is confirmed
      // IMPORTANT
      if (!user.emailConfirmed) {
        res.status(403);
        return res.json({
          success: false,
          message: 'Confirm your email address'
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
   * @param {Request} req request
   * @param {Response} res response
   */
  logout: (req, res) => {
    try {
      res.clearCookie('authToken');
      res.status(200);
      return res.json({
        success: true,
        message: 'Logged out'
      });
    } catch(error) {
      console.error(error);
      res.status(500);
      return res.json({
        success: false,
        message: 'Logout Error'
      });
    }
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
