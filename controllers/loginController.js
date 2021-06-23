var createError = require("http-errors");
var navbarController = require("../controllers/navbarController");

const { Pool } = require("pg");
const pool = new Pool();
const shajs = require("sha.js");

exports.checkLogin = function (req, res, next) {
  if (req.session.loggedIn === true) {
    pool.query("SELECT * FROM gebruikers WHERE id = $1", [req.session.userInformation.id], function (err, resp) {
      // ! Log error somehow!
      if (err) return res.send("error");

      req.session.loggedIn = true;

      // Aangezien de user nu ingelogd is, is het nuttig om ook de andere userdata bij te houden
      // in een sessie. Het gehashte wachtwoord wordt wel verwijderd, voor de veiligheid.
      req.session.userInformation = resp.rows[0];
      delete req.session.userInformation.wachtwoord;

      return next();
    });
  } else if (req.cookies.aangemeld_blijven) {
    exports.checkCookie(req, res, next);
  } else {
    next(createError(403, "403: Verboden toegang!"));
  }
};

exports.checkCookie = async function (req, res, next) {
  // ! Deze check blijft noodzakelijk, ook al staat die vanboven nog eens.
  // De functie wordt namelijk apart gebruikt in aanmelden.js, omdat daar geen 403 error moet
  // gecreëerd worden als iemand niet is ingelogd.
  if (req.cookies.aangemeld_blijven) {
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
          res.cookie("aangemeld_blijven", "", { maxAge: 0 });
          return next(createError(403, "403: Verboden toegang!"));
        }

        var timeDiff = new Date(resp.rows[0].vervaldatum).getTime() - new Date(Date.now()).getTime();

        // Fout: Indien de token niet meer geldig is in de database.
        if (timeDiff < 0) {
          pool.query("DELETE WHERE series_id = $1", [req.cookies.aangemeld_blijven.substring(0, 20)], function (err) {
            // ! Log possible error!
            res.cookie("aangemeld_blijven", "", { maxAge: 0 });
            return next(createError(403, "403: Verboden toegang!"));
          });
        }

        const token = req.cookies.aangemeld_blijven.substring(20, 40);
        const tokenHashed = shajs("sha256").update(token).digest("hex");

        if (tokenHashed == resp.rows[0].token) {
          req.session.userInformation = { id: resp.rows[0].gebruikers_id };
          req.session.loggedIn = true;

          await exports.getGebruikerInformatie(req, res, next);
        } else {
          res.cookie("aangemeld_blijven", "", { maxAge: 0 });
          return next(createError(403, "403: Verboden toegang! (Uw token hash is verkeerd!)"));
        }
      }
    );
  } else {
    return next();
  }
};

exports.getGebruikerInformatie = async function (req, res, next) {
  try {
    const gebruikerInformatie = await pool.query("SELECT * FROM gebruikers WHERE id = $1", [
      req.session.userInformation.id,
    ]);
  } catch (err) {
    // ! Somehow log this
    return next(createError(500, "500: Interne serverfout."));
  }

  // Aangezien de user nu ingelogd is, is het nuttig om ook de andere userdata bij te houden
  // in een sessie. Het gehashte wachtwoord wordt wel verwijderd, voor de veiligheid.
  req.session.userInformation = resp2.rows[0];
  delete req.session.userInformation.wachtwoord;
};

exports.getRollen = async function (req, res, next) {
  req.session.userInformation.rollen = await pool.query(
    "SELECT id, json_agg(toegangen.url) FROM gebruikers " +
      "LEFT JOIN gebruikers_rollen ON (gebruikers.id = gebruikers_rollen.gebruiker) " +
      "INNER JOIN rollen ON (gebruikers_rollen.rol = rollen.naam)" +
      "INNER JOIN toegangen ON (rollen.toegang = toegangen.naam)" +
      "WHERE gebruikers.id = 1" +
      "GROUP BY id"
  );
};
