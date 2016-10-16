const {Router} = require('restify-router');
const authRouter = new Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (app, mountPoint) => {
  authRouter.post(`${mountPoint}/`, (req, res) => {
    if (!req.body) {
      res.send(403, {error: true, message: 'Body empty'});
    }

    let authUser = {};
    User.findOne({username: req.body.username}).then((user) => {
      if (!user) {
        return Promise.resolve(false);
      }
      authUser = user;
      return user.comparePassword(req.body.password);
    }).then((isMatch) => {
      if (isMatch) {
        let token = jwt.sign(authUser, app.config.secret, {
          expiresIn: '24hr'
        });
        res.send(201, {token: token});
      } else {
        res.send(401, {message: "Login authentication failed"});
      }
    }).catch((err) => {
      res.send(403, {error: true, message: err});
    });
  });

  authRouter.applyRoutes(app.server);
};
