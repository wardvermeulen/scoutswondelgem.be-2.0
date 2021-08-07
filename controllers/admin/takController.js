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
