var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  sqlClient.query("select * from coffees", function (err, data) {
    if (err) throw err;
    res.render("home", {coffees: data});
  });
});

module.exports = router;