var jade = require("jade");
var path = require("path");
var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

var cart = {};
var index = 0;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.Router());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/bower_components", express.static(path.join(__dirname, "bower_components")));

app.get("/", function (req, res) {
  sqlClient.query("select * from coffees", function (err, coffees) {
    if (err) throw err;
    res.render("home", {coffees: coffees});
  });
});

app.get("/cart", function (req, res) {
  res.render("cart", cart);
  console.log (cart);
});

server.listen(3000, function () {
  console.log("Server Running at http://localhost:3000/");
});

io.sockets.on("connection", function (socket) {
  socket.on("cart", function (data) {
    console.log(data);
    sqlClient.query("update coffees set stock = stock - 1 where name = ?", [data.name],
      function (err, result) {
        if (err) throw err;
      });
    for (item in cart) {
      if (c.name == data.name) {
        c.qty++;
      }
      else {
        cart[index] = {name: data.name, image: data.image, price: data.price, qty: 1};
        index++;
      }
    }
  });
});
