var crypto = require("crypto");
var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});

var messages = "";

exports.new = function (req, res) {
  res.render("sessions/new", {messages: messages});
};

exports.create = function (req, res) {
  sqlClient.query("select PassWord, FirstName from users where EMail = ?", [req.body.email],
  function (err, result) {
    if (err) throw err;
    authenticate(req, res, result);
  });
};

exports.delete = function (req, res) {
  req.session.userEmail = null;
  req.session.userName = null;
  res.redirect("/");
};

var authenticate = function (req, res, result) {
  if (result == null) {
    messages = "Sorry, This Email Does Not Exist. Please Try Again.";
    res.redirect("/login");
  } 
  else if (wrongPassword(result[0].PassWord, req.body.password)) {
    messages = "Sorry, This Password Is Not Correct. Please Try Again.";
    res.redirect("/login");      
  }
  else {
    messages = "";
    req.session.userEmail = req.body.email;
    req.session.userName = result[0].FirstName;
    res.redirect("/");
  }
};

var wrongPassword = function (password, input) {
  return password != encrypt(input);
};

var encrypt = function (password) {
  var shasum = crypto.createHash("sha1")
  shasum.update(password);
  return shasum.digest("base64");
};