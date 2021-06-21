require("dotenv").config();
var createError = require("http-errors");

const { Pool } = require("pg");
const pool = new Pool();

exports.get = function (req, res, next) {
  pool.query("SELECT * FROM gebruikers ORDER BY naam ASC", function (err, resp) {
    if (err) {
      // ! Somehow log error
    } else {
      res.render("admin/gebruikers/gebruikers", {
        title: "Gebruikers",
        navbar: res.locals.navbarData,
        users: resp.rows,
      });
    }
  });
};

exports.getBewerken = function (req, res, next) {
  pool.query("SELECT * FROM gebruikers WHERE id = $1", [req.params.id], function (err, resp) {
    if (err) {
      // ! Somehow log error
      next(createError(500, "Interne serverfout."));
    } else if (!resp.rows[0]) {
      next(createError(400, "Gebruiker niet gevonden."));
    } else {
      res.render("admin/gebruikers/bewerken", {
        title: resp.rows[0].naam,
        navbar: res.locals.navbarData,
        user: resp.rows[0],
      });
    }
  });
};
