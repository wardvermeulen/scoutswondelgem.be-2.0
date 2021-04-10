var express = require("express");
var router = express.Router();

const { Pool } = require("pg");
const pool = new Pool();

router.get(
  "/",
  function (req, res, next) {
    pool.query("SELECT * FROM settings WHERE name='navbar'", function (err, resp) {
      res.locals.navbarData = JSON.parse(resp.rows[0].value);
      next();
    });
  },
  function (req, res, next) {
    res.render("index", { title: "Scouts Wondelgem", navbar: res.locals.navbarData });
  }
);

module.exports = router;
