var createError = require("http-errors");

const { Pool } = require("pg");
const pool = new Pool();
const shajs = require("sha.js");

/**
 * Contoleert de login van de gebruiker.
 */
exports.checkLogin = async function (req, res, next) {
  if (req.session.ingelogd === true) {
    try {
      await exports.getGebruikersInformatie(req, res, next);
    } catch (err) {
      console.log(err);
      return next(createError(err.code, err.msg));
    }

    // Als er geen checkToegang wordt meegegeven vooraleer de checkLogin functie wordt opgeroepen,
    // dan is de pagina beschikbaar voor elke ingelogde gebruiker!
    if (res.locals.checkToegang) {
      if (!req.session.gebruikersInformatie.toegang) {
        return next(createError(403, "403: Verboden toegang!"));
      }
      if (!req.session.gebruikersInformatie.toegang.includes(res.locals.checkToegang)) {
        return next(createError(403, "403: Verboden toegang!"));
      }
    }

    return next();
  } else if (req.cookies.aangemeld_blijven) {
    try {
      await exports.checkCookie(req, res, next);
    } catch (err) {
      return next(createError(err.code, err.msg));
    }

    await exports.checkLogin(req, res, next);
  } else {
    if (req.baseUrl == "/aanmelden") {
      // Er hoeft geen 403 error te worden gecreërd als de gebruiker niet ingelogd is. De aanmeld-
      // pagina moet in dat geval worden weergegeven.
      return next();
    }
    return next(createError(403, "403: Verboden toegang!"));
  }
};

/**
 * Controleert op de geldigheid van de cookie. Indien de cookie geldig is, wordt de gebruiker
 * ingelogd. Bekijk hiervoor zeker de documentatie.
 */
exports.checkCookie = async function (req, res, next) {
  let resp;
  try {
    resp = await pool.query("SELECT * FROM authentication_tokens WHERE series_id = $1", [
      req.cookies.aangemeld_blijven.substring(0, 20),
    ]);
  } catch (err) {
    // ! Somehow log this
    throw { code: 500, msg: "500: Interne serverfout." };
  }

  // Fout: Indien er geen resultaat wordt gevonden.
  if (resp.rowCount == 0) {
    res.cookie("aangemeld_blijven", "", { maxAge: 0 });
    throw { code: 403, msg: "403: Verboden toegang!" };
  }

  // Fout: Indien de token niet meer geldig is in de database.
  var timeDiff = new Date(resp.rows[0].vervaldatum).getTime() - new Date(Date.now()).getTime();
  if (timeDiff < 0) {
    // Verwijder de token zowel uit de database als uit de cookie.
    try {
      await pool.query("DELETE WHERE series_id = $1", [req.cookies.aangemeld_blijven.substring(0, 20)]);
    } catch (err) {
      // ! Somehow log this
    }
    res.cookie("aangemeld_blijven", "", { maxAge: 0 });
    throw { code: 403, msg: "403: Verboden toegang!" };
  }

  const token = req.cookies.aangemeld_blijven.substring(20, 40);
  const tokenHashed = shajs("sha256").update(token).digest("hex");

  // Juist: Als de SHA-256 hash uit de database matcht met de tokenHashed uit de cookie.
  if (tokenHashed == resp.rows[0].token) {
    req.session.gebruikersInformatie = { id: resp.rows[0].gebruikers_id };
    req.session.ingelogd = true;
  } else {
    res.cookie("aangemeld_blijven", "", { maxAge: 0 });
    throw { code: 403, msg: "403: Verboden toegang!" };
  }
};

/**
 * Aparte functie die de gebruikersinformatie afhaalt van de database en opslaat in de session
 * variabele "gebruikersInformatie". Deze functie wordt elke keer opgeroepen als checkLogin
 * wordt opgeroepen, zodat er niet hoeft gecontroleerd te worden op eventuele aanpassingen.
 */
exports.getGebruikersInformatie = async function (req, res, next) {
  let gebruikersInformatie;
  try {
    gebruikersInformatie = await pool.query("SELECT * FROM gebruikers WHERE id = $1", [
      req.session.gebruikersInformatie.id,
    ]);
  } catch (err) {
    // ! Somehow log this
    console.log(err);
    throw { code: 500, msg: "500: Interne serverfout." };
  }

  // Aangezien de user nu ingelogd is, is het nuttig om ook de andere userdata bij te houden
  // in een sessie. Het gehashte wachtwoord wordt wel verwijderd, voor de veiligheid.
  req.session.gebruikersInformatie = gebruikersInformatie.rows[0];
  delete req.session.gebruikersInformatie.wachtwoord;

  await exports.getToegang(req, res, next);
};

/**
 * Deze query staat apart omdat ze redelijk complex is en makkelijk zou kunnen worden aangepast
 * worden, indien dit nodig zou zijn.
 */
exports.getToegang = async function (req, res, next) {
  let result;
  try {
    result = await pool.query(
      "SELECT json_agg(DISTINCT toegangen.naam) AS toegang, " +
        "json_agg(DISTINCT jsonb_build_object('menu_naam', toegangen.menu_naam, 'url', toegangen.url)) AS toegang_info FROM gebruikers " +
        "LEFT JOIN gebruikers_rollen ON (gebruikers.id = gebruikers_rollen.gebruiker) " +
        "INNER JOIN rollen ON (gebruikers_rollen.rol = rollen.naam)" +
        "INNER JOIN toegangen ON (rollen.toegang = toegangen.naam)" +
        "WHERE gebruikers.id = $1" +
        "GROUP BY id",
      [req.session.gebruikersInformatie.id]
    );
  } catch (err) {
    // ! Somehow log this
    console.log(err);
    throw { code: 500, msg: "500: Interne serverfout." };
  }

  if (result.rowCount != 0) {
    req.session.gebruikersInformatie.toegang = result.rows[0].toegang;
    req.session.gebruikersInformatie.toegangInfo = result.rows[0].toegang_info;
  }
};
