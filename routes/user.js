var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});
var crypto = require("crypto");
var _ = require("underscore");
var $ = require("jquery-deferred");

var messages = "";

exports.new = function(req, res){
  var emptyData = [{ EMail: "", LastName: "", FirstName: "", Address: "", City: "", ZipCode: ""}]
  res.render("users/new", {user: emptyData, messages: messages});
};

exports.create = function(req, res){
  var def = $.Deferred();
  existingUsers(def)
  def.done(function (users) {
    if (_.contains(users, req.body.email)) {
      messages = "Sorry, This Email Already Exist."
      res.redirect("/users/new");
    }
    else {
      messages = "";
      sqlClient.query("insert into users set ?",
        { EMail: req.body.email,
          PassWord: encrypt(req.body.password),
          LastName: req.body.lname,
          FirstName:req.body.fname,
          Address: req.body.address,
          City: req.body.city,
          ZipCode: req.body.zipcode },
        function (err, result) {
          if (err) throw err;
          res.redirect("/users/" + result.insertId);
        });
    }
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
  sqlClient.query("update users set ? where P_ID = ?",
    [ { EMail: req.body.email,
        PassWord: encrypt(req.body.password),
        LastName: req.body.lname,
        FirstName:req.body.fname,
        Address: req.body.address,
        City: req.body.city,
        ZipCode: req.body.zipcode }, req.param("id")],
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

var encrypt = function (password) {
  var shasum = crypto.createHash("sha1")
  shasum.update(password);
  return shasum.digest("base64");
};

var existingUsers = function (def) {
  sqlClient.query("select EMail from users", function (err, result) {
    if (err) throw err;
    def.resolve(_.map(result, function(user){ return user.EMail; }));
  });
};
