const { Pool } = require("pg");
const pool = new Pool();
var createError = require("http-errors");

const multer = require("multer");
const upload = multer();
const fs = require("fs");
const sharp = require("sharp");

/**
 * /takken
 */
exports.getTakken = async function (req, res, next) {
  let takken;
  try {
    takken = await pool.query("SELECT * FROM takken ORDER BY volgorde");
  } catch (err) {
    // ! Somehow log this
    return next(createError(500, "500: Interne serverfout."));
  }

  res.render("admin/tak/takken", { title: "Takken", navbar: req.session.navbarData, takken: takken.rows });
};

/**
 * /tak
 */
exports.getTak = async function (req, res, next) {
  let tak;

  try {
    exports.controleerToegang(req, res, next);
    tak = res.locals.tak;
  } catch (err) {
    return res.redirect("../tak");
  }

  let takInformatie;

  try {
    takInformatie = await pool.query("SELECT * FROM takken WHERE url_naam = $1", [tak]);
  } catch (err) {
    // ! Somehow log this
    return next(createError(500, "500: Interne serverfout."));
  }

  // De admin zou een verkeerde tak kunnen opgeven in de route, dan wordt deze error gegeven.
  if (takInformatie.rowCount === 0) {
    return next(createError(500, "400: Die tak bestaat niet."));
  }

  let maandbrieven;

  try {
    maandbrieven = await pool.query(
      "SELECT * FROM takken_maandbrieven WHERE url_tak_naam = $1 ORDER BY upload_datum DESC, bestandsnaam ASC",
      [tak]
    );
  } catch (err) {
    // ! Somehow log this
    return next(createError(500, "500: Interne serverfout."));
  }

  res.render("admin/tak/tak", {
    title: tak,
    navbar: req.session.navbarData,
    tak: takInformatie.rows[0],
    maandbrieven: maandbrieven.rows,
  });
};

/**
 * Speciale functie die controleert of er toevallig geen admin geprobeert heeft om de tak te
 * bereiken via een query parameter in de url. Als dat het geval is moet er natuurlijk wel
 * nog eens extra gecontroleerd worden of de toegang "takken" wel behoord tot de toegangen van die
 * gebruiker. Als er geen tak is opgegeven in de url wordt gewoon de dat die opgeslagen is in de
 * sessie gebruikt. Het zal dus altijd enkel nuttig zijn voor leiding om deze pagina's te zien,
 * aangezien enkel leiding een tak heeft.
 */
exports.controleerToegang = function (req, res, next) {
  let tak;

  if (req.params.tak) {
    if (!req.session.gebruikersInformatie.toegang.includes("takken")) {
      throw "error";
    }
    tak = req.params.tak;
  } else {
    tak = req.session.gebruikersInformatie.tak;
  }

  res.locals.tak = tak;
};

/**
 * Er wordt een front-end script gebruikt om de Quill Delta JSON op te halen van de database,
 * omdat het niet mogelijk is om iets nuttigs met die JSON data te doen in de render engine.
 */
exports.getTekstje = async function (req, res, next) {
  let tak;

  try {
    exports.controleerToegang(req, res, next);
    tak = res.locals.tak;
  } catch (err) {
    // Technisch gezien zou dit betekenen dat de toegang niet mogelijk is, maar dit zou eigenlijk
    // enkel gebruikt worden als iemand echt browset naar bv. /tak/(Kapoenen/)tekstje. Gewoon
    // null returnen (ipv een error code is dus voldoende).
    return res.json(null);
  }

  let tekstjeJson;

  try {
    tekstjeJson = await pool.query("SELECT tekstje_json FROM takken WHERE url_naam = $1", [tak]);
  } catch (err) {
    // ! Somehow log this error
    return res.json(null);
  }

  if (tekstjeJson.rowCount !== 0) {
    res.json(tekstjeJson.rows[0].tekstje_json);
  } else {
    res.json(null);
  }
};

exports.postTekstje = async function (req, res, next) {
  let tak;

  try {
    exports.controleerToegang(req, res, next);
    tak = res.locals.tak;
  } catch (err) {
    // Technisch gezien zou dit betekenen dat de toegang niet mogelijk is, maar dit zou eigenlijk
    // enkel gebruikt worden als iemand echt POST naar bv. /tak/tekstje/(Kapoenen).
    return res.json({ type: "error", msg: "U bent niet gemachtigd om te posten voor deze tak." });
  }

  try {
    await pool.query("UPDATE takken SET tekstje_json = $1, tekstje_html = $2 WHERE url_naam = $3", [
      req.body.tekstje_json,
      req.body.tekstje_html,
      tak,
    ]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }
  res.json({ type: "success", msg: "Tekstje succesvol opgeslagen!" });
};

exports.multerMaandbrief = upload.any("maandbrief");

exports.postMaandbrief = async function (req, res, next) {
  let tak;

  try {
    exports.controleerToegang(req, res, next);
    tak = res.locals.tak;
  } catch (err) {
    // Technisch gezien zou dit betekenen dat de toegang niet mogelijk is, maar dit zou eigenlijk
    // enkel gebruikt worden als iemand echt POST naar bv. /tak/maandbrief/(tak)
    return res.json({ type: "error", msg: "U bent niet gemachtigd om te posten voor deze tak." });
  }

  // Kijken of de folder /public/uploads/maandbrieven/<tak> bestaat, en indien dat niet het geval is, de folder aanmaken.
  if (!fs.existsSync("public/uploads/maandbrieven/" + tak)) {
    try {
      fs.mkdirSync("public/uploads/maandbrieven/" + tak, { recursive: true });
    } catch (err) {
      // ! Somehow log this
      console.error(err);
      return res.json({ type: "error", msg: "Er ging iets mis bij het aanmaken van een folder." });
    }
  }

  // Controleren of er wel minstens één file is meegegeven.
  if (req.files.length === 0) {
    return res.json({ type: "error", msg: "U moet een bestand selecteren!" });
  }

  let msg = "";

  // Elk bestand opslaan op de juiste plaats.
  req.files.forEach(async function (file) {
    // De buffer van het bestand en de naam opslaan. Multer heeft ervoor gezorgd dat die informatie in req.files zit.
    const { buffer, originalname } = file;
    const path = "/uploads/maandbrieven/" + tak + "/" + encodeURIComponent(originalname);

    // Flag "wx" overschrijft het bestand NIET als het bestand met die naam al bestaat! In plaats daarvan zal
    // dit toegevoegd worden aan de response message, zodat de gebruiker weet dat de bestandsnaam moet worden aangepast
    // of het oude bestand eerst moet worden verwijderd.
    try {
      fs.writeFileSync("public" + path, buffer, { flag: "wx" });
    } catch (err) {
      // ! Somehow log this
      msg +=
        "Het bestand " +
        originalname +
        " bestaat al. Wijzig eerst de naam van het bestand of verwijder het oude bestand. </br>";
      return;
    }

    try {
      await pool.query(
        "INSERT INTO takken_maandbrieven (url_tak_naam, bestandsnaam, pad, upload_datum) VALUES ($1, $2, $3, $4)",
        // ? Locale en-GB is bijvoorbeeld dit: 16/08/2021, 21:30:13.
        [tak, originalname, path, new Date(Date.now()).toLocaleString("en-GB")]
      );
    } catch (err) {
      // ! Somehow log this
      msg += "Er ging iets fout bij het toevoegen van " + originalname + " aan de database. <br />";
    }
  });

  if (msg === "") {
    res.json({ type: "success", msg: "Bestand(en) succesvol opgeslagen!", reload: true });
  } else {
    res.json({ type: "error", msg: msg });
  }
};

/**
 * Functie om te togglen of een maandbrief moet worden weergegeven of niet.
 */
exports.putMaandbrief = function (req, res, next) {
  let tak;

  console.log(new Date(Date.now()).toLocaleString("en-GB"));

  try {
    exports.controleerToegang(req, res, next);
    tak = res.locals.tak;
  } catch (err) {
    // Technisch gezien zou dit betekenen dat de toegang niet mogelijk is, maar dit zou eigenlijk
    // enkel gebruikt worden als iemand echt PUT naar bv. /tak/maandbrief/(tak)
    return res.json({ type: "error", msg: "U bent niet gemachtigd om te putten voor deze tak." });
  }

  // Fancy UPDATE statement dat gewoon de boolean flipt :).
  try {
    pool.query(
      "UPDATE takken_maandbrieven SET weergeven = NOT weergeven WHERE url_tak_naam = $1 AND bestandsnaam = $2",
      [tak, req.body.naam]
    );
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets mis bij het aanpassen van de database." });
  }

  res.json({ type: "success", msg: "Weergeefstatus succesvol aangepast." });
};

/**
 * Functie om een maandbrief te verwijderen.
 */
exports.deleteMaandbrief = async function (req, res, next) {
  let tak;

  try {
    exports.controleerToegang(req, res, next);
    tak = res.locals.tak;
  } catch (err) {
    // Technisch gezien zou dit betekenen dat de toegang niet mogelijk is, maar dit zou eigenlijk
    // enkel gebruikt worden als iemand echt PUT naar bv. /tak/maandbrief/(tak)
    return res.json({ type: "error", msg: "U bent niet gemachtigd om te deleten voor deze tak." });
  }

  let pad;

  try {
    pad = await pool.query("SELECT pad FROM takken_maandbrieven WHERE url_tak_naam = $1 AND bestandsnaam = $2", [
      tak,
      req.body.naam,
    ]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets mis bij het lezen van de database." });
  }

  fs.unlinkSync("public" + pad.rows[0].pad);

  try {
    await pool.query("DELETE FROM takken_maandbrieven WHERE url_tak_naam = $1 AND bestandsnaam = $2", [
      tak,
      req.body.naam,
    ]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets mis bij het aanpassen van de database." });
  }

  res.json({ type: "success", msg: "Bestand succesvol verwijderd." });
};

exports.postEmail = async function (req, res, next) {
  let tak;

  try {
    exports.controleerToegang(req, res, next);
    tak = res.locals.tak;
  } catch (err) {
    // Technisch gezien zou dit betekenen dat de toegang niet mogelijk is, maar dit zou eigenlijk
    // enkel gebruikt worden als iemand echt POST naar bv. /tak/maandbrief/(tak)
    return res.json({ type: "error", msg: "U bent niet gemachtigd om te posten voor deze tak." });
  }

  console.log(req.body.email);

  try {
    await pool.query("UPDATE takken SET email = $1 WHERE url_naam = $2", [req.body.email, tak]);
  } catch (err) {
    // ! Somehow log this
    console.log(err);
    return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }

  res.json({ type: "success", msg: "E-mailadres succesvol aangepast." });
};
