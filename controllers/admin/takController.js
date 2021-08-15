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

  res.render("admin/tak/tak", { title: tak, navbar: req.session.navbarData, tak: takInformatie.rows[0] });
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

  // Kijken of de folder /public/uploads bestaat, en indien dat niet het geval is, de folder aanmaken.
  if (!fs.existsSync("public/uploads")) {
    try {
      fs.mkdirSync("public/uploads");
    } catch (err) {
      // ! Somehow log this
      console.error(err);
      return res.json({ type: "error", msg: "Er ging iets mis bij het aanmaken van een folder." });
    }
  }

  // Kijken of de folder /public/uploads/maandbrieven bestaat, en indien dat niet het geval is, de folder aanmaken.
  if (!fs.existsSync("public/uploads/maandbrieven")) {
    try {
      fs.mkdirSync("public/uploads/maandbrieven");
    } catch (err) {
      // ! Somehow log this
      console.error(err);
      return res.json({ type: "error", msg: "Er ging iets mis bij het aanmaken van een folder." });
    }
  }

  // Kijken of de folder /public/uploads/maandbrieven/<tak> bestaat, en indien dat niet het geval is, de folder aanmaken.
  if (!fs.existsSync("public/uploads/maandbrieven/" + tak)) {
    try {
      fs.mkdirSync("public/uploads/maandbrieven/" + tak);
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
  // // De buffer van het bestand en de naam opslaan. Multer heeft ervoor gezorgd dat die informatie in req.file zit.
  // const { buffer, originalName } = req.file;
  // const path = "/uploads/profielfoto/" + req.session.gebruikersInformatie.naam.replace(/\s+/g, "") + ".jpg";

  // try {
  //   await sharp(buffer)
  //     .jpeg({ quality: 80 })
  //     .toFile("public" + path);
  // } catch (err) {
  //   return res.json({
  //     type: "error",
  //     msg: "Het bestand dat u heeft opgegeven kan niet worden geconverteerd naar JPEG!",
  //   });
  // }

  // try {
  //   await pool.query("UPDATE gebruikers SET afbeelding = $1 WHERE id = $2", [
  //     path,
  //     req.session.gebruikersInformatie.id,
  //   ]);
  // } catch (err) {
  //   // ! Somehow log this
  //   return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  // }

  res.json({ type: "success", msg: "Bestand(en) succesvol opgeslagen!" });
};
