var _ = require("underscore");
var $ = require("jquery-deferred");
var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});

var Cart = (function () {
  function Cart () {}

  Cart.addItem = function (socket) {
    socket.on("cart", function (data) {
      Cart.updateCoffeeStock(1, data);
      Cart.update(data);
    });
  };

  Cart.update = function (data) {
    var def = $.Deferred();
    this.currentCart(def);
    def.done(function (cart) {
      if (_.contains(cart, data.name)) {
        Cart.updateExistingItem("item_count + 1", data);
      }
      else {
        Cart.createNewItem(data);
      }
    });
  };

  Cart.empty = function (timerID) {
    clearTimeout(timerID);
    var def = $.Deferred();
    this.returnCoffeeStock(def);
    def.done(function () {
      sqlClient.query("delete from cart", function (err) {
        if (err) throw err;
      });
    });
  };

  Cart.returnCoffeeStock = function (def) {
    sqlClient.query("select item_name, item_count from cart", function (err, data) {
      if (err) throw err;
      _.each(data, function (item) {
        Cart.updateCoffeeStock(-item.item_count, item.item_name);
      });
    });
  };

  Cart.updateCoffeeStock = function (count, data) {
    sqlClient.query("update coffees set stock = stock - ? where name = ?", [count, data.name],
      function (err) {
        if (err) throw err;
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
    sqlClient.query('update cart set item_count = ? where item_name = ?',
      [count, data.name],
      function (err) {
        if (err) throw err;
      });
  };

  Cart.currentCart = function (def) {
    sqlClient.query("select item_name from cart", function (err, data) {
      if (err) throw err;
      return def.resolve(_.map(data, function(d){ return d.item_name }));
    });
  };
  return Cart;
})();

module.exports = Cart;
