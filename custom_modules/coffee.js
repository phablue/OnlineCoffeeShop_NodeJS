var _ = require("underscore");
var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});

var Coffee = (function () {
  function Coffee () {}

  Coffee.returnStock = function (def) {
    sqlClient.query("select item_name, item_count from cart", function (err, data) {
      if (err) throw err;
      _.each(data, function (item) {
        Cart.updateStock(-item.item_count, item.item_name);
      });
    });
  };

  Coffee.updateStock = function (count, data) {
    sqlClient.query("update coffees set stock = stock - ? where name = ?", [count, data.name],
      function (err) {
        if (err) throw err;
      });
  };

  return Coffee;
})();

module.exports = Coffee;
