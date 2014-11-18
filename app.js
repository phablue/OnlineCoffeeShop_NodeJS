var jade = require("jade");
var path = require("path");
var bodyParser = require('body-parser');
var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var cart = require("./custom_modules/cart.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.Router());
app.use(bodyParser());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/bower_components", express.static(path.join(__dirname, "bower_components")));

app.get("/", function (req, res) {
  sqlClient.query("select * from coffees", function (err, data) {
    if (err) throw err;
    res.render("home", {coffees: data});
  });
});

app.get("/cart", function (req, res) {
  sqlClient.query("select * from cart", function (err, data) {
    if (err) throw err;
    res.render("cart", {items: data});
  });
});

app.post("/cart/update/:name", function (req, res) {
  var difference = parseInt(req.body.count) - parseInt(req.body.origin);
  cart.updateExistingItem(req.body.count, {name:req.param("name")});
  cart.updateCoffeeStock(difference, {name:req.param("name")});
  res.redirect("/cart");
});

app.get("/cart/delete/:name", function (req, res) {
  sqlClient.query("delete from cart where item_name = ?", [req.param("name")],
    function (err) {
      if (err) throw err;
      cart.updateCoffeeStock(-req.query.qty, {name:req.param("name")});
      res.redirect("/cart");
    });
});

server.listen(3000, function () {
  console.log("Server Running at http://localhost:3000/");
});

io.sockets.on("connection", function (socket) {
  cart.addItem(socket);
  var timerID = setTimeout(function () {
    cart.empty(timerID);
  }, 1000 * 60 * 60 * 3);
});
