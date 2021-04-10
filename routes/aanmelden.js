var express = require("express");
var router = express.Router();

const { Pool } = require("pg");
const pool = new Pool();
const bcrypt = require("bcrypt");

var navbarController = require("../controllers/navbarController");

router.get("/", navbarController.getNavbar, function (req, res, next) {
  res.render("aanmelden/aanmelden", {
    title: "Aanmelden",
    navbar: res.locals.navbarData,
  });
});

router.post("/", function (req, res, next) {
  pool.query("SELECT * FROM gebruikers WHERE email = $1", [req.body.email], function (err, resp) {
    // Checken of er wel een resultaat is gevonden voor het mailadres.
    if (resp.rows.length == 0) {
      // res.send verstuurt gewoon een aantwoord naar ajax, de rest wordt bij de client afgehandeld.
      res.send("failure");
      return;
    }

    // De gevonden hash vergelijken met het wachtwoord van de form
    bcrypt.compare(req.body.password, resp.rows[0].password, function (err, result) {
      if (result == false) {
        res.send("failure");
      } else {
        // Deze sessie boolean kan overal gebruikt worden om te controleren of de gebruiker is
        // aangemeld.
        req.session.loggedIn = true;

        // Aangezien de user nu ingelogd is, is het nuttig om ook de andere userdata bij te houden
        // in een sessie. Het gehashte wachtwoord wordt wel verwijderd, voor de veiligheid.
        req.session.userInformation = resp.rows[0];
        delete req.session.userInformation.password;

        // Ook de redirect wordt bij de client afgehandeld.
        res.send("success");
      }
    });
  });
});

router.get("/wachtwoord_vergeten", navbarController.getNavbar, function (req, res, next) {
  res.render("aanmelden/wachtwoord_vergeten", {
    title: "Wachtwoord Vergeten",
    navbar: res.locals.navbarData,
  });
});

module.exports = router;
