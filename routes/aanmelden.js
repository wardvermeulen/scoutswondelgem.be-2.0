require("dotenv").config();
var express = require("express");
var router = express.Router();

const { Pool } = require("pg");
const pool = new Pool();
const bcrypt = require("bcrypt");

var navbarController = require("../controllers/navbarController");

router.get("/", navbarController.getNavbar, function (req, res, next) {
  res.render("aanmelden", {
    title: "Aanmelden",
    navbar: res.locals.navbarData,
  });
});

router.post("/", function (req, res, next) {
  pool.query("SELECT * FROM gebruikers WHERE email = $1", [req.body.email], function (err, resp) {
    if (resp.rows.length == 0) {
      console.log("Email niet gevonden.");
      res.redirect("/aanmelden");
      return;
    }
    bcrypt.compare(req.body.password, resp.rows[0].password, function (err, result) {
      if (result == false) {
        console.log("fail");
      } else {
        console.log("success");
      }
      res.redirect("/aanmelden");
    });
  });
});

module.exports = router;
