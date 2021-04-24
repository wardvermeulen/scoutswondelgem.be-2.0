var createError = require("http-errors");
var navbarController = require("../controllers/navbarController");

exports.checkLogin = function (req, res, next) {
  if (req.session.loggedIn === true) {
    next();
  } else {
    next(createError(403, "403: Verboden toegang!"));
  }
};
