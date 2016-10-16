const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/' + env);

const auth = (req, res, next) => {
  let token = res.body || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.send(403, {error: true, message: err});
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send(401, {message: "You need to login"});
  }
}

module.exports = auth;
