var sqlClient = require("mysql").createConnection({user: "root", password: "root", database: "CoffeeShop"});

exports.new = function(req, res){
  res.render("users/new");
};

exports.create = function(req, res){
  sqlClient.query("insert into users set ?", {EMail: req.body.email, PassWord: req.body.password},
    function (err, result) {
      if (err) throw err;
      res.redirect("/users/" + result.P_ID);
    });
};

exports.show = function(req, res){
  sqlClient.query("select * from users where P_ID = ?", [req.param("id")],
    function (err, result) {
      if (err) throw err;
      res.render("show", {user: result});
    });
};

exports.edit = function(req, res){
  res.render("users/edit");
};

exports.update = function(req, res){
  sqlClient.query("update users set ? where P_ID = ?",
    [{EMail: req.body.email, PassWord: req.body.password}, req.param("id")],
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
