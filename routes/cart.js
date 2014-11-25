var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});
var cart = require("../custom_modules/cart.js");
var coffee = require("../custom_modules/coffee.js");

exports.index = function(req, res){
  sqlClient.query("select * from cart", function (err, data) {
    if (err) throw err;
    res.render("cart/index", {items: data});
  });
};

exports.update = function(req, res){
  var difference = parseInt(req.body.count) - parseInt(req.body.origin);
  cart.updateExistingItem(req.body.count, {name:req.param("name")});
  coffee.updateStock(difference, {name:req.param("name")});
  res.redirect("/cart");
};

exports.delete = function(req, res){
  sqlClient.query("delete from cart where item_name = ?", [req.param("name")],
    function (err) {
      if (err) throw err;
      coffee.updateStock(-req.query.qty, {name:req.param("name")});
      res.redirect("/cart");
    });
};
