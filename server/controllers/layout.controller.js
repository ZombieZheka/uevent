// server/controllers/layout.controller.js

const jwt = require('jsonwebtoken');
<<<<<<< Updated upstream
=======
const { check, validationResult } = require('express-validator');
>>>>>>> Stashed changes

module.exports = {
  /**
   * Reads authentification token
   * @param {Request} req request
   * @param {Response} res response
   * @param {Function} next next handler
   */
  authentificate: async (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
      req.authentificated = false;
      return next();
    }

    await jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.error(err);
        res.status(500);
        return res.json({
          success: false,
          message: 'Authentification Error'
        });
      }

      req.user_id = user.id;
      req.user_name = user.name;
      req.authentificated = true;
    });
    next();
  },
  /**
   * Checks if user authentificated,
   * if not sends a message,
   * otherwise calls next handler
   *
   * @param {Request} req request
   * @param {Response} res response
   * @param {Function} next next handler
   */
  authRequired: (req, res, next) => {
    if (!req.authentificated) {
      res.status(401);
      return res.json({
        success: false,
        message: 'Authentification required'
      });
    }
    next();
  },

  /**
   * Validate ticket purchase request
   */
  validateTicketPurchase: [
    check('eventId').notEmpty().isMongoId().withMessage('Invalid event ID'),
    check('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400);
        return res.json({
          success: false,
          errors: errors.array()
        });
      }
      next();
    }
  ]
};
