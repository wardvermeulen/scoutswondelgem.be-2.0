const { Pool } = require("pg");
const pool = new Pool();
var createError = require("http-errors");

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

exports.controleerToegang = function (req, res, next) {
  let tak;

  // TODO: fucky wucky

  // De admin kan aan elke tak door bijvoorbeeld /tak/Kapoenen.
  if (req.params.tak !== req.session.gebruikersInformatie.tak) {
    if (!req.session.gebruikersInformatie.toegang.includes("takken")) {
      delete req.params.tak;
      throw "error";
    }
    tak = req.params.tak;
  } else {
    tak = req.session.gebruikersInformatie.tak;
  }

  res.locals.tak = tak;
};

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

exports.getTekstje = async function (req, res, next) {
  let tak;

  try {
    exports.controleerToegang(req, res, next);
    tak = res.locals.tak;
  } catch (err) {
    // Technisch gezien zou dit betekenen dat de toegang niet mogelijk is, maar dit zou eigenlijk
    // enkel gebruikt worden als iemand echt browset naar bv. /tak/(Kapoenen/)tekstje.
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
    // enkel gebruikt worden als iemand echt POST naar bv. /tak/(Kapoenen/)tekstje.
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
