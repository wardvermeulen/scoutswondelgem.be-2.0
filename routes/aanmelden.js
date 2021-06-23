var express = require("express");
var router = express.Router();

const { Pool } = require("pg");
const pool = new Pool();
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const shajs = require("sha.js");

var navbarController = require("../controllers/navbarController");
var loginController = require("../controllers/loginController");

router.get("/", loginController.checkCookie, navbarController.getNavbar, function (req, res, next) {
  if (req.session.loggedIn) {
    return res.redirect("/admin");
  }

  res.render("aanmelden/aanmelden", {
    title: "Aanmelden",
    navbar: req.session.navbarData,
  });
});

router.post(
  "/",
  function (req, res, next) {
    pool.query("SELECT * FROM gebruikers WHERE email = $1", [req.body.email], function (err, resp) {
      // ! Log error somehow!
      if (err) return res.send("error");

      // Checken of er wel een resultaat is gevonden voor het mailadres.
      if (resp.rows.length == 0) {
        // res.send verstuurt gewoon een aantwoord naar ajax, de rest wordt bij de client afgehandeld.
        res.send("failure");
        return;
      }

      // De gevonden hash vergelijken met het wachtwoord van de form
      bcrypt.compare(req.body.wachtwoord, resp.rows[0].wachtwoord, function (err, result) {
        if (result === true) {
          // Deze sessie boolean kan overal gebruikt worden om te controleren of de gebruiker is
          // aangemeld.
          req.session.loggedIn = true;

          // Aangezien de user nu ingelogd is, is het nuttig om ook de andere userdata bij te houden
          // in een sessie. Het gehashte wachtwoord wordt wel verwijderd, voor de veiligheid.
          req.session.userInformation = resp.rows[0];
          delete req.session.userInformation.wachtwoord;

          if (req.body.aangemeldBlijven) {
            // Als de user vraagt om aangemeld te blijven, wordt er doorverwezen naar de volgende
            // call-back function waarin de logica van de cookies wordt uitgewerkt.
            return next();
          } else {
            // Ook de redirect wordt bij de client afgehandeld.
            res.send("success");
          }
        } else {
          res.send("failure");
        }
      });
    });
  },
  async function (req, res, next) {
    // Check de documentatie voor dit gedeelte!

    // Controleren op uniciteit van de  series identifier.
    let seriesIDs;
    try {
      seriesIDs = await pool.query("SELECT series_id FROM authentication_tokens");
    } catch (err) {
      // ! Somehow log this
    }
    var seriesID = randomstring.generate(20);
    while (seriesIDs.rows.includes(seriesID)) {
      seriesID = randomstring.generate(20);
    }

    // Random token.
    const token = randomstring.generate(20);
    const tokenHashed = shajs("sha256").update(token).digest("hex");

    // Vervaldatum in UNIX tijd. Dit is trouwens goed voor 90 dagen.
    const expirationDate = new Date(Date.now() + 90 * 24 * 60 * 1000);

    // Nu enkel nog de token hashen en de data in de database plaatsen.
    pool.query(
      "INSERT INTO authentication_tokens (series_id, token, gebruikers_id, vervaldatum) VALUES ($1, $2, $3, $4)",
      [seriesID, tokenHashed, req.session.userInformation.id, expirationDate],
      function (err, resp) {
        if (err) {
          // ! Somehow log this
          return res.send("error");
        }

        // Nu we zeker zijn dat alles geslaagd is, kunnen we de cookie instellen!
        res.cookie("aangemeld_blijven", seriesID + token, { expires: new Date(expirationDate) });
        return res.send("success");
      }
    );
  }
);

router.get("/wachtwoord_vergeten", navbarController.getNavbar, function (req, res, next) {
  res.render("aanmelden/wachtwoord_vergeten", {
    title: "Wachtwoord Vergeten",
    navbar: req.session.navbarData,
  });
});

module.exports = router;
