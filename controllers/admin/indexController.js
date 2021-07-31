exports.get = function (req, res, next) {
  res.render("admin/index", { title: "Admin | Overzicht", navbar: req.session.navbarData });
};
