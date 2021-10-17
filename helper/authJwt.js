const expressJwt = require("express-jwt");

function authJwt() {
  return expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/product(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/category(.*)/, methods: ["GET", "OPTIONS"] },

      "/user/create",
      "/user/login",
    ],
  });
}

const isRevoked = async (req, payload, done) => {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
};

module.exports = authJwt;
