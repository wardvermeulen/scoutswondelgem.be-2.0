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

  req.body.categorienaam = req.body.categorienaam.trim();

  let bestaatCategorieAl;
  try {
    // ! Lower is nodig! Sharp overschrijft files die met andere capitalisatie beginnen.
    bestaatCategorieAl = await pool.query("SELECT * FROM foto_categorie WHERE lower(naam) = lower($1)", [
      req.body.categorienaam,
    ]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets mis bij het lezen van de database." });
  }

  if (bestaatCategorieAl.rowCount !== 0) {
    return res.json({ type: "error", msg: "Er bestaat al een categorie met die naam!" });
  } else if (!req.body.categorienaam || req.body.categorienaam.trim() === "") {
    return res.json({ type: "error", msg: "U moet een categorienaam opgeven!" });
  } else if (req.body.categorienaam === "omslagfotos") {
    return res.json({ type: "error", msg: "De naam 'omslagfotos' is gereserveerd." });
  }

  // Controleren of er wel een file is meegegeven.
  if (!req.file) {
    return res.json({ type: "error", msg: "U moet een bestand selecteren!" });
  }
  // De buffer van het bestand en de naam opslaan. Multer heeft ervoor gezorgd dat die informatie in req.file zit.
  const { buffer, originalname } = req.file;
  const path = "/uploads/fotos/omslagfotos/" + req.body.categorienaam + ".jpg";

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
    console.log(err);
    return res.json({ type: "error", msg: "Er ging iets fout bij het aanpassen van de database." });
  }

  res.json({ type: "success", msg: "Categorie succesvol aangemaakt." });
};

exports.controleerCategorie = async function (req, res, next) {
  let categorie;

  try {
    categorie = await pool.query("SELECT * FROM foto_categorie WHERE naam = $1", [req.params.categorie]);
  } catch (err) {
    // ! Somehow log this
    throw { code: 500, msg: "500: Interne serverfout." };
  }

  if (categorie.rowCount === 0) {
    throw { code: 400, msg: "400: De categorie " + req.params.categorie + " bestaat niet." };
  }

  return categorie;
};

exports.getCategorie = async function (req, res, next) {
  let categorie;
  try {
    categorie = await exports.controleerCategorie(req, res, next);
  } catch (err) {
    return next(createError(err.code, err.msg));
  }

  let albums;
  try {
    albums = await pool.query("SELECT * FROM foto_album WHERE categorie = $1", [req.params.categorie]);
  } catch (err) {
    return next(createError(500, "500: Interne serverfout."));
  }

  res.render("admin/fotos/categorie", {
    title: "Categorie | " + req.params.categorie,
    navbar: req.session.navbarData,
    categorie: categorie.rows[0],
    albums: albums.rows,
  });
};

exports.getAlbumToevoegen = async function (req, res, next) {
  let categorie;
  try {
    categorie = await exports.controleerCategorie(req, res, next);
  } catch (err) {
    return next(createError(err.code, err.msg));
  }

  res.render("admin/fotos/album_toevoegen", {
    title: "Album toevoegen",
    navbar: req.session.navbarData,
    categorie: categorie.rows[0],
  });
};

exports.multerAlbumToevoegen = multer().single("omslagfoto");

exports.postAlbumToevoegen = async function (req, res, next) {
  try {
    await exports.controleerCategorie(req, res, next);
  } catch (err) {
    return res.json({ type: "error", msg: err.msg });
  }

  const directory = "public/uploads/fotos/" + req.params.categorie + "/omslagfotos";
  if (!fs.existsSync(directory)) {
    try {
      fs.mkdirSync(directory, { recursive: true });
    } catch (err) {
      // ! Somehow log this
      return res.json({ type: "error", msg: "Er ging iets mis bij het aanmaken van een folder." });
    }
  }

  req.body.albumnaam = req.body.albumnaam.trim();

  let bestaatAlbumAl;
  try {
    bestaatAlbumAl = await pool.query(
      // ! Lower is nodig! Sharp overschrijft files die met andere capitalisatie beginnen.
      "SELECT * FROM foto_album WHERE lower(categorie) = lower($1) AND lower(naam) = lower($2)",
      [req.params.categorie, req.body.albumnaam]
    );
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets mis bij het lezen van de database." });
  }

  if (bestaatAlbumAl.rowCount !== 0) {
    return res.json({ type: "error", msg: "Er bestaat al een album met die naam!" });
  } else if (!req.body.albumnaam || req.body.albumnaam.trim() === "") {
    return res.json({ type: "error", msg: "U moet een albumnaam opgeven!" });
  } else if (req.body.albumnaam === "omslagfotos") {
    return res.json({ type: "error", msg: "De naam 'omslagfotos' is gereserveerd." });
  }

  // Controleren of er wel een file is meegegeven.
  if (!req.file) {
    return res.json({ type: "error", msg: "U moet een bestand selecteren!" });
  }
  // De buffer van het bestand en de naam opslaan. Multer heeft ervoor gezorgd dat die informatie in req.file zit.
  const { buffer, originalname } = req.file;
  const path = "/uploads/fotos/" + req.params.categorie + "/omslagfotos/" + req.body.albumnaam + ".jpg";

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
    maxVolgorde = await pool.query("SELECT max(volgorde) FROM foto_album");
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
    await pool.query("INSERT INTO foto_album (categorie, naam, omslagfoto, volgorde) VALUES ($1, $2, $3, $4)", [
      req.params.categorie,
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

exports.controleerAlbum = async function (req, res, next) {
  let album;
  try {
    album = await pool.query("SELECT * FROM foto_album WHERE categorie = $1 AND naam = $2", [
      req.params.categorie,
      req.params.album,
    ]);
  } catch (err) {
    // ! Somehow log this
    throw { code: 500, msg: "500: Interne serverfout." };
  }

  if (album.rowCount === 0) {
    throw {
      code: 400,
      msg: "400: Het album " + req.params.album + " in de categorie " + req.params.categorie + " bestaat niet.",
    };
  }

  return album;
};

exports.getAlbum = async function (req, res, next) {
  let album;
  try {
    album = await exports.controleerAlbum(req, res, next);
  } catch (err) {
    return next(createError(err.code, err.msg));
  }

  let fotos;
  try {
    fotos = await pool.query("SELECT * FROM foto WHERE categorie = $1 AND album = $2 ORDER BY volgorde ASC", [
      req.params.categorie,
      req.params.album,
    ]);
  } catch (err) {
    // ! Somehow log this
    return next(createError(500, "500: Interne serverfout."));
  }

  res.render("admin/fotos/album", {
    title: req.params.categorie + " | " + req.params.album,
    navbar: req.session.navbarData,
    fotos: fotos.rows,
  });
};

exports.getFotosToevoegen = async function (req, res, next) {
  let album;
  try {
    album = await exports.controleerAlbum(req, res, next);
  } catch (err) {
    return next(createError(err.code, err.msg));
  }

  res.render("admin/fotos/fotos_toevoegen", { title: "Foto's toevoegen", navbar: req.session.navbarData });
};

exports.multerFotosToevoegen = multer().any("fotos");

exports.postFotosToevoegen = async function (req, res, next) {
  let album;
  try {
    album = await exports.controleerAlbum(req, res, next);
  } catch (err) {
    return res.json({ type: "error", msg: err.msg });
  }

  console.log("hier");

  const directory = "public/uploads/fotos/" + req.params.categorie + "/" + req.params.album;
  if (!fs.existsSync(directory)) {
    try {
      fs.mkdirSync(directory, { recursive: true });
    } catch (err) {
      // ! Somehow log this
      return res.json({ type: "error", msg: "Er ging iets mis bij het aanmaken van een folder." });
    }
  }

  if (req.files.length === 0) {
    return res.json({ type: "error", msg: "U moet minstens één foto selecteren!" });
  }

  let maxVolgorde, volgorde;
  try {
    maxVolgorde = await pool.query("SELECT max(volgorde) FROM foto WHERE categorie = $1 AND album = $2", [
      req.params.categorie,
      req.params.album,
    ]);
  } catch (err) {
    // ! Somehow log this
    return res.json({ type: "error", msg: "Er ging iets fout bij het lezen van de database" });
  }

  if (maxVolgorde.rows[0].max === null) {
    volgorde = 0;
  } else {
    volgorde = maxVolgorde.rows[0].max;
  }

  let msg = "";

  req.files.forEach(async function (file) {
    volgorde++;

    // De buffer van het bestand en de naam opslaan. Multer heeft ervoor gezorgd dat die informatie in req.files zit.
    const { buffer, originalname } = file;
    const path =
      "/uploads/fotos/" +
      req.params.categorie +
      "/" +
      req.params.album +
      "/" +
      req.params.categorie +
      "-" +
      req.params.album +
      "-" +
      volgorde +
      ".jpg";

    // Flag "wx" overschrijft het bestand NIET als het bestand met die naam al bestaat!
    // In theorie kan dit niet gebeuren, maar dit verhindert het per ongeluk verwijderen van foto's, JIC.
    try {
      fs.writeFileSync("public" + path, buffer, { flag: "wx" });
    } catch (err) {
      // ! Somehow log this
      msg += "Het pad naar de afbeelding " + path + " bestaat al. Dit is waarschijnlijk een bug.";
      return;
    }

    try {
      await pool.query("INSERT INTO foto (categorie, album, volgorde, foto) VALUES ($1, $2, $3, $4)", [
        req.params.categorie,
        req.params.album,
        volgorde,
        path,
      ]);
    } catch (err) {
      // ! Somehow log this
      console.log(err);
      msg += "Er ging iets fout bij het toevoegen van " + originalname + " aan de database. <br />";
    }
  });

  if (msg === "") {
    res.json({ type: "success", msg: "Foto('s) succesvol geüpload." });
  } else {
    res.json({ type: "error", msg: msg });
  }
};
