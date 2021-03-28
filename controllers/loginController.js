var md5 = require('md5');
const { Pool } = require("pg");

const pool = new Pool();
exports.getLogin = function (req, res, next) {
    res.render("login", {
        title: "Login",
      });
  };

exports.postLogin = function (req, res, next) {
    //is md5 sterk genoeg?
    var md5Pwd = md5(req.body.password);
    //console.log(md5(md5Pwd));
    pool.query("SELECT * FROM users WHERE email="+ req.email, function (err, resp) {
        if(resp){
            //geen idee hoe we die tabel gaan indelen dus doe ik nu effe dit 
            if(resp.rows[0].colums[2]===md5Pwd){
                console.log("valid login");
            }
            else console.log("invalid login");
        }
        else console.log("invalid login");
        
    });
      
    next();
  };