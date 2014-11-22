var jade = require("jade");
var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var cartSocket = require("./custom_modules/cart.js");
var home = require("./routes/home");
var cart = require("./routes/cart");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.Router());
app.use(bodyParser());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/bower_components", express.static(path.join(__dirname, "bower_components")));

app.get("/", home.index);
app.get("/cart", cart.index);
app.post("/cart/:name/update", cart.update);
app.get("/cart/:name/delete", cart.delete);

server.listen(3000, function () {
  console.log("Server Running at http://localhost:3000/");
});

io.sockets.on("connection", function (socket) {
  cartSocket.addItem(socket);
  var timerID = setTimeout(function () {
    cartSocket.empty(timerID);
  }, 1000 * 60 * 60 * 3);
  cartSocket.purchase(socket, timerID);
});
