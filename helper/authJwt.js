const expressJwt = require("express-jwt");

function authJwt() {
  return expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({
    path: ["/category", "/product", "/user/create", "/user/login"],
  });
}
module.exports = authJwt;
