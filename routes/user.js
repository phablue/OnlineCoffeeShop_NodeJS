var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});
var _ = require("underscore");
var $ = require("jquery-deferred");
var crypto = require("../helper/crypto");

var messages = "";

exports.new = function(req, res){
  var emptyData = [{ EMail: "", LastName: "", FirstName: "", Address: "", City: "", ZipCode: ""}]
  res.render("users/new", {user: emptyData, messages: messages});
};

exports.create = function(req, res){
  var def = $.Deferred();
  existingUsers(def)
  def.done(function (users) {
    checkInvalid(users, req, res);
  });
};

exports.show = function(req, res){
  sqlClient.query("select * from users where P_ID = ?", [req.param("id")],
    function (err, result) {
      if (err) throw err;
      res.render("users/show", {user: result});
    });
};

exports.edit = function(req, res){
  sqlClient.query("select * from users where P_ID = ?", [req.param("id")],
    function (err, result) {
      if (err) throw err;
      res.render("users/edit", {user: result});
    });
};

exports.update = function(req, res){
  sqlClient.query("update users set ? where P_ID = ?", [ setUser(req), req.param("id")],
    function (err) {
      if (err) throw err;
      res.redirect("/users/" + req.param("id"));
    });
};

exports.delete = function(req, res){
  sqlClient.query("delete from users where id = ?", [req.param("id")],
    function (err) {
      if (err) throw err;
      res.redirect("/");
    });
};

var checkInvalid = function (users, req, res) {
  if (_.contains(users, req.body.email)) {
    unavailableEmail(res);
  }
  else {
    messages = "";
    createUser(req, res)
  }
};

var createUser = function (req, res) {
  sqlClient.query("insert into users set ?", setUser(req),
    function (err, result) {
      if (err) throw err;
      req.session.userEmail = req.body.email;
      req.session.userName = req.body.fname;
      res.redirect("/users/" + result.insertId);
    });
};

var unavailableEmail = function (res) {
  messages = "Sorry, This Email Already Exist."
  res.redirect("/users/new");
};

var setUser = function (req) {
  return { EMail: req.body.email,
           PassWord: crypto.encrypt(req.body.password),
           LastName: req.body.lname,
           FirstName:req.body.fname,
           Address: req.body.address,
           City: req.body.city,
           ZipCode: req.body.zipcode };
};

var existingUsers = function (def) {
  sqlClient.query("select EMail from users", function (err, result) {
    if (err) throw err;
    def.resolve(_.map(result, function(user){ return user.EMail; }));
  });
};
