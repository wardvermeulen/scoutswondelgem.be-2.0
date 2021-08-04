require("dotenv").config();

const { Pool } = require("pg");
const pool = new Pool();

const multer = require("multer");
const upload = multer();
const fs = require("fs");
const sharp = require("sharp");
const randomstring = require("randomstring");

exports.get = function (req, res, next) {
  res.render("admin/account/index", {
    title: "Account",
    navbar: req.session.navbarData,
    gebruiker: req.session.gebruikersInformatie,
  });
};

exports.multer = upload.single("profielfoto");

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
  const { buffer, originalName } = req.file;
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
    await pool.query("UPDATE gebruikers SET " + "afbeelding = $1 WHERE id = $2", [
      path,
      req.session.gebruikersInformatie.id,
    ]);
  } catch (err) {
    // ! Somehow log this
    res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }

  res.json({ type: "success", msg: "Profielfoto succesvol geüpload!", src: path });
};
