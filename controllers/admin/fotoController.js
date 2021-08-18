require("dotenv").config();

const { Pool } = require("pg");
const pool = new Pool();
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const createError = require("http-errors");

exports.get = async function (req, res, next) {
  let categorieen;

  try {
    categorieen = await pool.query("SELECT * FROM foto_categorie ORDER BY volgorde ASC");
  } catch (err) {
    // ! Somehow log this
    return next(createError(500, "500: Interne serverfout"));
  }

  res.render("admin/fotos/index", { title: "Foto's", navbar: req.session.navbarData, categorieen: categorieen.rows });
};

exports.getCategorieToevoegen = function (req, res, next) {
  res.render("admin/fotos/categorie_toevoegen", {
    title: "Foto's | Categorie toevoegen",
    navbar: req.session.navbarData,
  });
};

exports.multerCategorieToevoegen = multer().single("omslagfoto");

exports.postCategorieToevoegen = async function (req, res, next) {
  if (!fs.existsSync("public/uploads/fotos/omslagfotos")) {
    try {
      fs.mkdirSync("public/uploads/fotos/omslagfotos", { recursive: true });
    } catch (err) {
      // ! Somehow log this
      return res.json({ type: "error", msg: "Er ging iets mis bij het aanmaken van een folder." });
    }
  }

  let bestaatCategorieAl;

  try {
    bestaatCategorieAl = await pool.query("SELECT * FROM foto_categorie WHERE naam = $1", [req.body.categorienaam]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets mis bij het lezen van de database." });
  }

  if (bestaatCategorieAl.rowCount !== 0) {
    return res.json({ type: "error", msg: "Er bestaat al een album met die naam!" });
  }

  // Controleren of er wel een file is meegegeven.
  if (!req.file) {
    return res.json({ type: "error", msg: "U moet een bestand selecteren!" });
  }
  // De buffer van het bestand en de naam opslaan. Multer heeft ervoor gezorgd dat die informatie in req.file zit.
  const { buffer, originalname } = req.file;
  const path = "/uploads/fotos/omslagfotos/" + encodeURIComponent(req.body.categorienaam) + ".jpg";

  try {
    await sharp(buffer)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
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
    maxVolgorde = await pool.query("SELECT max(volgorde) FROM foto_categorie");
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
    await pool.query("INSERT INTO foto_categorie (naam, omslagfoto, volgorde) VALUES ($1, $2, $3)", [
      req.body.categorienaam,
      path,
      volgorde,
    ]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }

  res.json({ type: "success", msg: "Categorie succesvol aangemaakt." });
};

exports.getCategorie = async function (req, res, next) {
  let categorie;

  try {
    categorie = await pool.query("SELECT * FROM foto_categorie WHERE naam = $1", [req.params.categorie]);
  } catch (err) {
    // ! Somehow log this
    return next(createError(500, "500: Interne serverfout"));
  }

  if (categorie.rowCount === 0)
    return next(createError(400, "400: De categorie " + req.params.categorie + " bestaat niet."));

  res.render("admin/fotos/categorie", {
    title: "Categorie | " + req.params.categorie,
    navbar: req.session.navbarData,
    categorie: categorie.rows[0],
  });
};

exports.getAlbumToevoegen = async function (req, res, next) {
  let categorie;

  try {
    categorie = await pool.query("SELECT * FROM foto_categorie WHERE naam = $1", [req.params.categorie]);
  } catch (err) {
    // ! Somehow log this
    return next(createError(500, "500: Interne serverfout"));
  }

  if (categorie.rowCount === 0)
    return next(createError(400, "400: De categorie " + req.params.categorie + " bestaat niet."));

  res.render("admin/fotos/album_toevoegen", {
    title: "Album toevoegen",
    navbar: req.session.navbarData,
    categorie: categorie.rows[0],
  });
};
