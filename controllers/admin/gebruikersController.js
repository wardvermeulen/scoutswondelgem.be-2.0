require("dotenv").config();
var createError = require("http-errors");

const { Pool } = require("pg");
const pool = new Pool();
const bcrypt = require("bcrypt");

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
    return next(createError(500, "500: Interne serverfout."));
  }

  try {
    takken = await pool.query("SELECT naam, volgorde FROM takken ORDER BY volgorde ASC");
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

/**
 * POST route voor het bewerken van gebruikers.
 * @author Ward Vermeulen
 * @todo Willekeurig wachtwoord genereren.
 * @todo Profielfoto instellen.
 */
exports.postBewerken = async function (req, res, next) {
  if (!req.params.id) {
    return res.send("Er moet een ID opgegeven worden!");
  }

  if (req.body.afbeelding == "") req.body.afbeelding = null;
  if (req.body.gsm == "") req.body.gsm = null;
  if (req.body.tak == "Geen") req.body.tak = null;
  if (req.body.naam == "") return res.send("Er moet een naam worden opgegeven!");
  if (req.body.email == "") return res.send("Er moet een naam worden opgegeven!");

  let inTakken, inRollen;
  try {
    inTakken = await pool.query("SELECT * FROM takken WHERE naam = $1", [req.body.tak]);
  } catch (err) {
    return res.send("Interne serverfout!");
  }

  if (inTakken.rowCount == 0 && req.body.tak != null) {
    return res.send("De tak (" + req.body.tak + ") die u heeft opgegeven bestaat niet!");
  }

  if (req.body.rollen) {
    if (!Array.isArray(req.body.rollen)) {
      req.body.rollen = [req.body.rollen];
    }
    for (const rol of req.body.rollen) {
      try {
        inRollen = await pool.query("SELECT * FROM rollen WHERE naam = $1", [rol]);
      } catch (err) {
        return res.send("Interne serverfout!");
      }
      if (inRollen.rowCount == 0) {
        return res.send("De rol (" + rol + ") die u heeft opgegeven bestaat niet.");
      }
    }
  }

  let hashedWachtwoord = null;
  if (req.body.wachtwoord != "") {
    hashedWachtwoord = await bcrypt.hash(req.body.wachtwoord, 6);
  }

  if (hashedWachtwoord) {
    try {
      await pool.query(
        "UPDATE gebruikers SET " +
          "email = $1, " +
          "naam = $2, " +
          "wachtwoord = $3, " +
          "tak = $4, " +
          "gsm = $5 " +
          "WHERE id = $6",
        [req.body.email, req.body.naam, hashedWachtwoord, req.body.tak, req.body.gsm, req.params.id]
      );
      await pool.query("DELETE FROM authentication_tokens WHERE gebruikers_id = $1", [req.params.id]);
    } catch (err) {
      return res.send("Interne serverfout!");
    }
  } else {
    try {
      await pool.query(
        "UPDATE gebruikers SET " + "email = $1, " + "naam = $2, " + "tak = $3, " + "gsm = $4 " + "WHERE id = $5",
        [req.body.email, req.body.naam, req.body.tak, req.body.gsm, req.params.id]
      );
    } catch (err) {
      if (err.code == 23505) {
        return res.send("Dat emailadres wordt al gebruikt voor een andere gebruiker. " + err.detail);
      }
      return res.send("Interne serverfout!");
    }
  }

  let rollen;
  try {
    rollen = (await pool.query("SELECT rol FROM gebruikers_rollen WHERE gebruiker = $1", [req.params.id])).rows;
  } catch (err) {
    return res.send("Interne serverfout!");
  }

  if (rollen) {
    if (!req.body.rollen) {
      try {
        await pool.query("DELETE FROM gebruikers_rollen WHERE gebruiker = $1", [req.params.id]);
      } catch (err) {
        return res.send("Interne serverfout!");
      }
    } else {
      for (const element of rollen) {
        if (!req.body.rollen.includes(element.rol)) {
          try {
            await pool.query("DELETE FROM gebruikers_rollen WHERE gebruiker = $1 AND rol = $2", [
              req.params.id,
              element.rol,
            ]);
          } catch (err) {
            return res.send("Interne serverfout!");
          }
        }
      }
    }
  }

  if (req.body.rollen) {
    for (const rol of req.body.rollen) {
      try {
        await pool.query("INSERT INTO gebruikers_rollen (gebruiker, rol) VALUES ($1, $2) ON CONFLICT DO NOTHING", [
          req.params.id,
          rol,
        ]);
      } catch (err) {
        return res.send("Interne serverfout!");
      }
    }
  }

  res.send("success");
};
