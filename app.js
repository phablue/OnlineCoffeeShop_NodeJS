var jade = require("jade");
var path = require("path");
var mysql = require("mysql");
var client = mysql.createConnection({user: "root", password: "root", database: "CoffeeShop"});
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.Router());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
});

server.listen(8000, function () {
  console.log("Server Running at http://localhost:8000/");
});
