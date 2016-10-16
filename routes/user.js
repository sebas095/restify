const {Router} = require('restify-router');
const userRouter = new Router();
const User = require('../models/user');

module.exports = (app, mountPoint) => {
  userRouter.post(`${mountPoint}/`, (req, res) => {
    if (!req.body) {
      res.send(403, {error: true, message: "Body empty"});
    }

    const {username, password} = req.body;
    let newUser = {};

    User.findOne({username: username}).then((user) => {
      if (user) {
        newUser = user;
        return user.comparePassword(password);
      } else {
        return Promise.resolve(user);
      }
    }).then((isMatch) => {
      if (typeof isMatch === 'object') return User.create(req.body);
      else if (typeof isMatch === 'boolean') {
        res.send(201, {user: newUser.username});
      } else {
        res.send(403, {error: true, message: 'The user exist'});
      }
    }).then((user) => {
      if (user) res.send(201, {user: user.username});
    }).catch((err) => {
      res.send(403, {error: true, message: err});
    });

  });

  userRouter.applyRoutes(app.server);
};
