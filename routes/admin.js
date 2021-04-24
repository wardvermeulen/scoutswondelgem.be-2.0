var express = require("express");
var router = express.Router();

const { Pool } = require("pg");
const pool = new Pool();
const bcrypt = require("bcrypt");

var navbarController = require("../controllers/navbarController");
var indexController = require("../controllers/admin/indexController");
var gebruikersController = require("../controllers/admin/gebruikersController");
var loginController = require("../controllers/loginController");

//router.get("/", navbarController.getNavbar, indexController.get);

router.get("/gebruikers", loginController.checkLogin, navbarController.getNavbar, gebruikersController.get);
router.get(
  "/gebruikers/bewerken/:id",
  loginController.checkLogin,
  navbarController.getNavbar,
  gebruikersController.getBewerken
);

module.exports = router;
