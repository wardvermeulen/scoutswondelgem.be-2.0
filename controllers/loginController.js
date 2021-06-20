var createError = require("http-errors");
var navbarController = require("../controllers/navbarController");

const { Pool } = require("pg");
const pool = new Pool();
const shajs = require("sha.js");

exports.checkLogin = function (req, res, next) {
  if (req.session.loggedIn === true) {
    next();
  } else if (req.cookies.aangemeld_blijven) {
    // Hier wordt gecontroleerd op de geldigheid van de cookie. Indien de cookie geldig is,
    // wordt de gebruiker ingelogd.

    // Bekijk hiervoor de documentatie.
    pool.query(
      "SELECT * FROM authentication_tokens WHERE series_id = $1",
      [req.cookies.aangemeld_blijven.substring(0, 20)],
      function (err, resp) {
        // ! Somehow log this
        if (err) return next();

        // Fout: Indien er geen resultaat wordt gevonden.
        if (resp.rowCount == 0) {
          res.cookie(aangemeld_blijven, "", { maxAge: 0 });
          return next(createError(403, "403: Verboden toegang!"));
        }

        var timeDiff = new Date(resp.rows[0].vervaldatum).getTime() - new Date(Date.now()).getTime();

        // Fout: Indien de token niet meer geldig is in de database.
        if (timeDiff < 0) {
          pool.query("DELETE WHERE series_id = $1", [req.cookies.aangemeld_blijven.substring(0, 20)], function (err) {
            // ! Log possible error!
            res.cookie(aangemeld_blijven, "", { maxAge: 0 });
            return next(createError(403, "403: Verboden toegang!"));
          });
        }

        const token = req.cookies.aangemeld_blijven.substring(20, 40);
        const tokenHashed = shajs("sha256").update(token).digest("hex");

        if (tokenHashed == resp.rows[0].token) {
          pool.query("SELECT * FROM gebruikers WHERE id = $1", [resp.rows[0].gebruikers_id], function (err, resp2) {
            // ! Log error somehow!
            if (err) return res.send("error");

            req.session.loggedIn = true;

            // Aangezien de user nu ingelogd is, is het nuttig om ook de andere userdata bij te houden
            // in een sessie. Het gehashte wachtwoord wordt wel verwijderd, voor de veiligheid.
            req.session.userInformation = resp2.rows[0];
            delete req.session.userInformation.wachtwoord;

            return next();
          });
        } else {
          res.cookie(aangemeld_blijven, "", { maxAge: 0 });
          return next(createError(403, "403: Verboden toegang! (Uw token hash is verkeerd!)"));
        }
      }
    );
  } else {
    next(createError(403, "403: Verboden toegang!"));
  }
};
