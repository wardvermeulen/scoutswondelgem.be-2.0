require("dotenv").config();
var express = require("express");
var router = express.Router();
const { Pool } = require("pg");

const pool = new Pool();

var loginController = require("../controllers/loginController");


router.get("/",loginController.getLogin);
router.post("/",loginController.postLogin);


module.exports = router;
