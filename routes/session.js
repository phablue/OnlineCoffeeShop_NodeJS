var crypto = require("../helper/crypto");
var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});

var messages = "";

exports.new = function (req, res) {
  res.render("sessions/new", {messages: messages});
};

exports.create = function (req, res) {
  sqlClient.query("select P_ID, PassWord, FirstName from users where EMail = ?", [req.body.email],
  function (err, result) {
    if (err) throw err;
    authenticate(req, res, result);
  });
};

exports.delete = function (req, res) {
  req.session.userEmail = null;
  req.session.userName = null;
  req.session.userID = null;
  res.redirect("/");
};

var authenticate = function (req, res, result) {
  if (result.length == 0) {
    messages = errorMessages();
    res.redirect("/login");
  }
  else if (wrongPassword(result[0].PassWord, req.body.password)) {
    messages = errorMessages();
    res.redirect("/login");
  }
  else {
    messages = "";
    req.session.userEmail = req.body.email;
    req.session.userName = result[0].FirstName;
    req.session.userID = result[0].P_ID;
    res.redirect("/");
  }
};

var errorMessages = function () {
  return "There was an error with your E-Mail/Password combination. Please try again"
};

var wrongPassword = function (password, input) {
  return password != crypto.encrypt(input);
};
