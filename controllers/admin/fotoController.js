require("dotenv").config();

const { Pool } = require("pg");
const pool = new Pool();
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");

exports.get = function (req, res, next) {
  res.render("admin/fotos/index", { title: "Foto's", navbar: req.session.navbarData });
};

exports.getAlbumToevoegen = function (req, res, next) {
  res.render("admin/fotos/album_toevoegen", { title: "Foto's | Album toevoegen", navbar: req.session.navbarData });
};

exports.multerAlbumToevoegen = multer().single("omslagfoto");

exports.postAlbumToevoegen = async function (req, res, next) {
  if (!fs.existsSync("public/uploads/fotos/omslagfotos")) {
    try {
      fs.mkdirSync("public/uploads/fotos/omslagfotos", { recursive: true });
    } catch (err) {
      // ! Somehow log this
      return res.json({ type: "error", msg: "Er ging iets mis bij het aanmaken van een folder." });
    }
  }

  let bestaatAlbumAl;

  try {
    bestaatAlbumAl = await pool.query("SELECT * FROM foto_albums WHERE naam = $1", [req.body.albumnaam]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets mis bij het lezen van de database." });
  }

  if (bestaatAlbumAl.rowCount !== 0) {
    return res.json({ type: "error", msg: "Er bestaat al een album met die naam!" });
  }

  // Controleren of er wel een file is meegegeven.
  if (!req.file) {
    return res.json({ type: "error", msg: "U moet een bestand selecteren!" });
  }
  // De buffer van het bestand en de naam opslaan. Multer heeft ervoor gezorgd dat die informatie in req.file zit.
  const { buffer, originalname } = req.file;
  const path = "/uploads/fotos/omslagfotos/" + encodeURIComponent(req.body.albumnaam) + ".jpg";

  try {
    await sharp(buffer)
      .jpeg({ quality: 80 })
      .toFile("public" + path);
  } catch (err) {
    console.log(err);
    return res.json({
      type: "error",
      msg: "Het bestand dat u heeft opgegeven kan niet worden geconverteerd naar JPEG!",
    });
  }

  let maxVolgorde, volgorde;

  try {
    maxVolgorde = await pool.query("SELECT max(volgorde) FROM foto_albums");
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets fout bij het lezen van de database" });
  }

  if (maxVolgorde.rows[0].max === null) {
    volgorde = 1;
  } else {
    volgorde = maxVolgorde.rows[0].max + 1;
  }

  try {
    await pool.query("INSERT INTO foto_albums (naam, omslagfoto, volgorde) VALUES ($1, $2, $3)", [
      req.body.albumnaam,
      path,
      volgorde,
    ]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }

  res.json({ type: "success", msg: "Album succesvol aangemaakt." });
};
