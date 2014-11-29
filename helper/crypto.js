var crypto = require("crypto");

exports.encrypt = function (password) {
  var shasum = crypto.createHash("sha1")
  shasum.update(password);
  return shasum.digest("base64");
};
