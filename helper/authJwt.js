const expressJwt = require("express-jwt");

function authJwt() {
  return expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/product(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/category(.*)/, methods: ["GET", "OPTIONS"] },

      "/user/create",
      "/user/login",
    ],
  });
}
module.exports = authJwt;
