const {Router} = require('restify-router');
const indexRouter = new Router();

module.exports = (app, mountPoint) => {
  indexRouter.get(`${mountPoint}/`, (req, res) => {
    res.send(200, {message: 'Hello World'});
  });

  indexRouter.applyRoutes(app.server);
};
