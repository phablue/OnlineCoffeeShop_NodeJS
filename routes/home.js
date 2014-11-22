var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});

exports.index = function (req, res) {
  sqlClient.query("select * from coffees", function (err, data) {
    if (err) throw err;
    res.render("home", {coffees: data});
  });
};