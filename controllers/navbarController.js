require("dotenv").config();

const { Pool } = require("pg");
const pool = new Pool();

exports.getNavbar = function (req, res, next) {
  pool.query("SELECT * FROM settings WHERE name='navbar'", function (err, resp) {
    res.locals.navbarData = JSON.parse(resp.rows[0].value);
    next();
  });
};
