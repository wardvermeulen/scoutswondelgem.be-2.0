var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var session = require("express-session");
require("dotenv").config();

var indexRouter = require("./routes/index");
var aanmeldenRouter = require("./routes/aanmelden");
var adminRouter = require("./routes/admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jsx");
app.engine("jsx", require("express-react-views").createEngine());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "TopSecretScoutsWondelgem",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/", indexRouter);
app.use("/aanmelden", aanmeldenRouter);
app.use("/admin", adminRouter);

// Nodig om navbar van de database te halen, ook bij errors. Een externe handler lijkt niet
// mogelijk te zijn dus is het hier gehardcoceerd.
require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool();

var navbarController = require("./controllers/navbarController");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, "404: Pagina niet gevonden!"));
});

// error handler
app.use(async function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log(req.app.get("env"));

  await navbarController.getNavbar(req, res, next);

  res.status(err.status || 500);
  res.render("error", { title: "Error " + err.status || 500, navbar: req.session.navbarData });
});

module.exports = app;
