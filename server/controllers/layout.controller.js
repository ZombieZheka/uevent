// server/controllers/layout.controller.js

module.exports = {
  /**
   * Reads authentification token
   * @param {Request} req request
   * @param {Response} res response
   * @param {Function} next next handler
   */
  authentificate: (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      req.authentificated = false;
      return next();
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
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
      })
    }
    next();
  }
};
