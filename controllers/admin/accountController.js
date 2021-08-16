require("dotenv").config();

const { Pool } = require("pg");
const pool = new Pool();

const bcrypt = require("bcrypt");
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const sharp = require("sharp");

exports.get = function (req, res, next) {
  res.render("admin/account/index", {
    title: "Account",
    navbar: req.session.navbarData,
    gebruiker: req.session.gebruikersInformatie,
  });
};

exports.postInfo = async function (req, res, next) {
  try {
    await pool.query("UPDATE gebruikers SET gsm = $1 WHERE id = $2", [
      req.body.gsm === "" ? null : req.body.gsm,
      req.session.gebruikersInformatie.id,
    ]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }
  res.json({ type: "success", msg: "Succesvol opgeslagen!" });
};

exports.getTekstje = async function (req, res, next) {
  let tekstjeJson;

  try {
    tekstjeJson = await pool.query("SELECT tekstje_json FROM gebruikers_tekstje WHERE id = $1", [
      req.session.gebruikersInformatie.id,
    ]);
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
  try {
    await pool.query(
      "INSERT INTO gebruikers_tekstje (id, tekstje_json, tekstje_html) VALUES ($1, $2, $3) " +
        "ON CONFLICT (id) DO UPDATE SET tekstje_json = $2, tekstje_html = $3",
      [req.session.gebruikersInformatie.id, req.body.tekstje_json, req.body.tekstje_html]
    );
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }
  res.json({ type: "success", msg: "Tekstje succesvol opgeslagen!" });
};

exports.postWachtwoord = async function (req, res, next) {
  if (req.body.oud === "") req.body.oud = null;
  if (req.body.nieuw === "") req.body.nieuw = null;
  if (req.body.nieuw2 === "") req.body.nieuw2 = null;

  // Controleren op lege velden
  if (!req.body.oud || !req.body.nieuw || !req.body.nieuw2) {
    return res.json({ type: "error", msg: "Een van de velden is leeg." });
  }

  if (req.body.nieuw !== req.body.nieuw2) {
    return res.json({ type: "error", msg: "De twee nieuwe wachtwoorden komen niet overeen." });
  }

  if (req.body.nieuw.length < 8) {
    return res.json({ type: "error", msg: "Uw nieuw wachtwoord moet minstens 8 karakters lang zijn." });
  }

  let resp;
  try {
    resp = await pool.query("SELECT wachtwoord FROM gebruikers WHERE id = $1", [req.session.gebruikersInformatie.id]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }

  let wachtwoordCorrect;
  try {
    wachtwoordCorrect = await bcrypt.compare(req.body.oud, resp.rows[0].wachtwoord);
    if (!wachtwoordCorrect) {
      return res.json({ type: "error", msg: "Het oude wachtwoord dat u heeft opgegeven is fout." });
    }
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets mis bij het vergelijken van de wachtwoorden." });
  }

  const hashedWachtwoord = await bcrypt.hash(req.body.nieuw, 6);

  try {
    await pool.query("UPDATE gebruikers SET wachtwoord = $1 WHERE id = $2", [
      hashedWachtwoord,
      req.session.gebruikersInformatie.id,
    ]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }

  try {
    await pool.query("DELETE FROM authentication_tokens WHERE gebruikers_id = $1", [
      req.session.gebruikersInformatie.id,
    ]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }

  res.json({ type: "success", msg: "Wachtwoord succesvol bijgewerkt!" });
};

exports.multerProfielfoto = upload.single("profielfoto");

exports.postProfielfoto = async function (req, res, next) {
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

  // Kijken of de folder /public/uploads/profielfoto bestaat, en indien dat niet het geval is, de folder aanmaken.
  if (!fs.existsSync("public/uploads/profielfoto")) {
    try {
      fs.mkdirSync("public/uploads/profielfoto");
    } catch (err) {
      // ! Somehow log this
      console.error(err);
      return res.json({ type: "error", msg: "Er ging iets mis bij het aanmaken van een folder." });
    }
  }

  // Controleren of er wel een file is meegegeven.
  if (!req.file) {
    return res.json({ type: "error", msg: "U moet een bestand selecteren!" });
  }
  // De buffer van het bestand en de naam opslaan. Multer heeft ervoor gezorgd dat die informatie in req.file zit.
  const { buffer, originalname } = req.file;
  const path = "/uploads/profielfoto/" + req.session.gebruikersInformatie.naam.replace(/\s+/g, "") + ".jpg";

  try {
    await sharp(buffer)
      .jpeg({ quality: 80 })
      .toFile("public" + path);
  } catch (err) {
    return res.json({
      type: "error",
      msg: "Het bestand dat u heeft opgegeven kan niet worden geconverteerd naar JPEG!",
    });
  }

  try {
    await pool.query("UPDATE gebruikers SET afbeelding = $1 WHERE id = $2", [
      path,
      req.session.gebruikersInformatie.id,
    ]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }

  res.json({ type: "success", msg: "Profielfoto succesvol geüpload!", src: path });
};
