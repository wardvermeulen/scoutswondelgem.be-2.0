require("dotenv").config();
var createError = require("http-errors");

const { Pool } = require("pg");
const pool = new Pool();

/*
SELECT id, json_agg(toegangen.url) FROM gebruikers
LEFT JOIN gebruikers_rollen ON (gebruikers.id = gebruikers_rollen.gebruiker)
INNER JOIN rollen ON (gebruikers_rollen.rol = rollen.naam)
INNER JOIN toegangen ON (rollen.toegang = toegangen.naam)
WHERE gebruikers.id = 1
GROUP BY id
*/

exports.get = function (req, res, next) {
  // Query die enkel de noodzakelijke informatie van de gebruikers ophaalt, en alle rollen die
  // de gebruiker heeft, aggregeert naar json!
  pool.query(
    "SELECT gebruikers.*, json_agg(DISTINCT rol ORDER BY rol ASC) AS rollen FROM gebruikers " +
      "LEFT JOIN gebruikers_rollen ON (gebruikers.id = gebruikers_rollen.gebruiker) " +
      "GROUP BY id ORDER BY naam ASC",
    function (err, resp) {
      if (err) {
        // ! Somehow log error
      } else {
        res.render("admin/gebruikers/gebruikers", {
          title: "Gebruikers",
          navbar: req.session.navbarData,
          users: resp.rows,
        });
      }
    }
  );
};

exports.getBewerken = async function (req, res, next) {
  // Als er geen id wordt opgegeven, wordt er geredirect naar /admin/gebruikers.
  if (!req.params.id) return res.redirect("/admin/gebruikers");

  let gebruiker, takken, rollen;

  try {
    gebruiker = await pool.query(
      "SELECT gebruikers.*, json_agg(DISTINCT rol ORDER BY rol ASC) AS rollen FROM gebruikers " +
        "LEFT JOIN gebruikers_rollen ON (gebruikers.id = gebruikers_rollen.gebruiker) " +
        "WHERE id = $1 " +
        "GROUP BY id",
      [req.params.id]
    );
  } catch (err) {
    // ! Somehow log error
    return next(createError(500, "Interne serverfout."));
  }

  try {
    takken = await pool.query("SELECT naam, volgorde FROM takken");
  } catch (err) {
    // ! Somehow log error
    return next(createError(500, "500: Interne serverfout."));
  }

  try {
    rollen = await pool.query("SELECT DISTINCT ON (naam) * FROM rollen");
  } catch (err) {
    // ! Somehow log error
    return next(createError(500, "500: Interne serverfout."));
  }

  if (gebruiker.rowCount == 0) {
    return next(createError(400, "400: Gebruiker niet gevonden."));
  }

  res.render("admin/gebruikers/bewerken", {
    title: gebruiker.rows[0].naam,
    navbar: req.session.navbarData,
    gebruiker: gebruiker.rows[0],
    takken: takken.rows,
    rollen: rollen.rows,
  });
};
