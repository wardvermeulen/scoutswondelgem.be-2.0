var express = require("express");
var router = express.Router();

const { Pool } = require("pg");
const pool = new Pool();
const bcrypt = require("bcrypt");

var navbarController = require("../controllers/navbarController");
var indexController = require("../controllers/admin/indexController");
var gebruikersController = require("../controllers/admin/gebruikersController");
var loginController = require("../controllers/loginController");
var accountController = require("../controllers/admin/accountController");

// * Index *

router.get("/", loginController.checkLogin, navbarController.getNavbar, indexController.get);

// * Gebruikers *

router.get(
  "/gebruikers",
  function (req, res, next) {
    res.locals.checkToegang = "gebruikers";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  gebruikersController.get
);

router.get(
  "/gebruikers/bewerken/:id?",
  function (req, res, next) {
    res.locals.checkToegang = "gebruikers_bewerken";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  gebruikersController.getBewerken
);

router.post(
  "/gebruikers/bewerken/:id?",
  function (req, res, next) {
    res.locals.checkToegang = "gebruikers_bewerken";
    return next();
  },
  loginController.checkLogin,
  gebruikersController.postBewerken
);

// * Account *

router.get(
  "/account",
  function (req, res, next) {
    res.locals.checkToegang = "account";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  accountController.get
);

router.post(
  "/account/profielfoto",
  function (req, res, next) {
    res.locals.checkToegang = "account";
    return next();
  },
  loginController.checkLogin,
  accountController.multer,
  accountController.postProfielfoto
);

module.exports = router;
