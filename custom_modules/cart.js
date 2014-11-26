var _ = require("underscore");
var $ = require("jquery-deferred");
var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});
var coffee = require("../custom_modules/coffee.js");

var Cart = (function () {
  function Cart () {}

  Cart.addItem = function (socket) {
    socket.on("cart", function (data) {
      Cart.update(data);
    });
  };

  Cart.purchase = function (socket, timerID) {
    socket.on("buy", function () {
      clearTimeout(timerID);
      sqlClient.query("delete from cart", function (err) {
        if (err) throw err;
      });
    });
  };

  Cart.update = function (data) {
    var def = $.Deferred();
    this.currentCart(def);
    def.done(function (cart) {
      if (_.contains(_.keys(cart), data.name)) {
        Cart.updateExistingItem(cart[data.name]+1, data);
      }
      else {
        Cart.createNewItem(data);
      }
      coffee.updateStock(1, data);
    });
  };

  Cart.empty = function (timerID) {
    clearTimeout(timerID);
    var def = $.Deferred();
    coffee.returnStock(def);
    def.done(function () {
      sqlClient.query("delete from cart", function (err) {
        if (err) throw err;
      });
    });
  };

  Cart.createNewItem = function (data) {
    sqlClient.query("insert into cart set ?",
      {item_name: data.name, item_image: data.image, item_price: data.price, item_count: 1},
      function (err) {
        if (err) throw err;
      });
  };

  Cart.updateExistingItem = function (count, data) {
    sqlClient.query("update cart set item_count = ? where item_name = ?",
      [count, data.name],
      function (err) {
        if (err) throw err;
      });
  };

  Cart.currentCart = function (def) {
    sqlClient.query("select item_name, item_count from cart", function (err, data) {
      var cart = {}
      if (err) throw err;
      _.map(data, function(d){ return cart[d.item_name] = d.item_count; });
      def.resolve(cart);
    });
  };

  return Cart;
})();

module.exports = Cart;
