const { Pool } = require("pg");
const pool = new Pool();

exports.get = function (req, res, next) {
  res.render("admin/index", {
    title: "Admin | Overzicht",
    navbar: req.session.navbarData,
    toegangInfo: req.session.gebruikersInformatie.toegangInfo,
  });
};
