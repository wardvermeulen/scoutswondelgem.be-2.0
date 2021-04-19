var express = require("express");
var router = express.Router();

const { Pool } = require("pg");
const pool = new Pool();

var navbarController = require("../controllers/navbarController");

router.get("/", navbarController.getNavbar, function (req, res, next) {
  res.render("index", { title: "Scouts Wondelgem", navbar: res.locals.navbarData });
});

module.exports = router;
