var express = require("express");
var router = express.Router();

var navbarController = require("../controllers/navbarController");
var indexController = require("../controllers/admin/indexController");
var gebruikersController = require("../controllers/admin/gebruikersController");
var loginController = require("../controllers/loginController");
var accountController = require("../controllers/admin/accountController");
var takController = require("../controllers/admin/takController");
var fotoController = require("../controllers/admin/fotoController");

// ! Dit bestand is gigantisch, niets aan te doen: nutteloos om voor elk pad een aparte router te maken
// ! aangezien er al voor elk pad een aparte controller is.
// ? Misschien is dit toch iets om te overwegen, persoonlijk wel niet echt een fan van.

/**********************************************************************************************************************
 * * Index
 *********************************************************************************************************************/

router.get("/", loginController.checkLogin, navbarController.getNavbar, indexController.get);

/**********************************************************************************************************************
 * * Gebruikers
 *********************************************************************************************************************/

router.get(
  "/gebruikers",
  function (req, res, next) {
    res.locals.checkToegang = "gebruikers";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  gebruikersController.get
);

router.get(
  "/gebruikers/bewerken/:id?",
  function (req, res, next) {
    res.locals.checkToegang = "gebruikers_bewerken";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  gebruikersController.getBewerken
);

router.post(
  "/gebruikers/bewerken/:id?",
  function (req, res, next) {
    res.locals.checkToegang = "gebruikers_bewerken";
    return next();
  },
  loginController.checkLogin,
  gebruikersController.postBewerken
);

/**********************************************************************************************************************
 * * Account
 *********************************************************************************************************************/

router.get(
  "/account",
  function (req, res, next) {
    res.locals.checkToegang = "account";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  accountController.get
);

router.post(
  "/account/info",
  function (req, res, next) {
    res.locals.checkToegang = "account";
    return next();
  },
  loginController.checkLogin,
  accountController.postInfo
);

router.get(
  "/account/tekstje",
  function (req, res, next) {
    res.locals.checkToegang = "account";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  accountController.getTekstje
);

router.post(
  "/account/tekstje",
  function (req, res, next) {
    res.locals.checkToegang = "account";
    return next();
  },
  loginController.checkLogin,
  accountController.postTekstje
);

router.post(
  "/account/wachtwoord",
  function (req, res, next) {
    res.locals.checkToegang = "account";
    return next();
  },
  loginController.checkLogin,
  accountController.postWachtwoord
);

router.post(
  "/account/profielfoto",
  function (req, res, next) {
    res.locals.checkToegang = "account";
    return next();
  },
  loginController.checkLogin,
  accountController.multerProfielfoto,
  accountController.postProfielfoto
);

/**********************************************************************************************************************
 * * Takken
 *********************************************************************************************************************/

router.get(
  "/takken",
  function (req, res, next) {
    res.locals.checkToegang = "takken";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  takController.getTakken
);

router.get(
  "/tak/tekstje/:tak?",
  function (req, res, next) {
    res.locals.checkToegang = "account";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  takController.getTekstje
);

// ! Volgorde belangrijk! Als je deze controller voor die van /tak/tekstje/:tak? zet dan zal de router denken
// ! Dat als er gebrowset wordt naar /tak/tekstje, er met "tekstje" een tak bedoeld wordt. Laat dit dus zo staan.
router.get(
  "/tak/:tak?",
  function (req, res, next) {
    res.locals.checkToegang = "tak";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  takController.getTak
);

router.post(
  "/tak/tekstje/:tak?",
  function (req, res, next) {
    res.locals.checkToegang = "account";
    return next();
  },
  loginController.checkLogin,
  takController.postTekstje
);

router.post(
  "/tak/maandbrief/:tak?",
  function (req, res, next) {
    res.locals.checkToegang = "tak";
    return next();
  },
  loginController.checkLogin,
  takController.multerMaandbrief,
  takController.postMaandbrief
);

router.put(
  "/tak/maandbrief/:tak?",
  function (req, res, next) {
    res.locals.checkToegang = "tak";
    return next();
  },
  loginController.checkLogin,
  takController.multerMaandbrief,
  takController.putMaandbrief
);

router.delete(
  "/tak/maandbrief/:tak?",
  function (req, res, next) {
    res.locals.checkToegang = "tak";
    return next();
  },
  loginController.checkLogin,
  takController.multerMaandbrief,
  takController.deleteMaandbrief
);

router.post(
  "/tak/email/:tak?",
  function (req, res, next) {
    res.locals.checkToegang = "tak";
    return next();
  },
  loginController.checkLogin,
  takController.multerMaandbrief,
  takController.postEmail
);

/**********************************************************************************************************************
 * * Foto's
 *********************************************************************************************************************/

router.get(
  "/fotos",
  function (req, res, next) {
    res.locals.checkToegang = "fotos";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  fotoController.get
);

router.get(
  "/fotos/categorie_toevoegen",
  function (req, res, next) {
    res.locals.checkToegang = "fotos";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  fotoController.getCategorieToevoegen
);

router.post(
  "/fotos/categorie_toevoegen",
  function (req, res, next) {
    res.locals.checkToegang = "fotos";
    return next();
  },
  loginController.checkLogin,
  fotoController.multerCategorieToevoegen,
  fotoController.postCategorieToevoegen
);

router.get(
  "/fotos/:categorie",
  function (req, res, next) {
    res.locals.checkToegang = "fotos";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  fotoController.getCategorie
);

router.get(
  "/fotos/:categorie/album_toevoegen",
  function (req, res, next) {
    res.locals.checkToegang = "fotos";
    return next();
  },
  loginController.checkLogin,
  navbarController.getNavbar,
  fotoController.getAlbumToevoegen
);

module.exports = router;
