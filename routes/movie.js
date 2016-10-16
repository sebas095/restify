const {Router} = require('restify-router');
const movieRouter = new Router();

let Movie = {};

module.exports = (app, mountPoint) => {
  movieRouter.post(`${mountPoint}/`, (req, res) => {
    console.log("POST", req.body);
    if (!req.body) {
      res.send(403, {error: true, message: "Body empty"});
    }

    let _movie = req.body;
    _movie._id = Date.now();
    Movie[_movie._id] = _movie;

    res.send(201, {movie: Movie[_movie._id]});
  });

  movieRouter.applyRoutes(app.server);
};
