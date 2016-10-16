const {Router} = require('restify-router');
const movieRouter = new Router();
const _ = require('lodash');

let Movie = {};

module.exports = (app, mountPoint) => {
  movieRouter.get(`${mountPoint}/`, (req, res) => {
    console.log("GET: ", req.body);
    res.send(200, {movies: _.values(Movie)});
  });

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

  movieRouter.get(`${mountPoint}/:id`, (req, res) => {
    console.log("GET:id ", req.params.id);
    if (!req.params.id) {
      res.send(403, {error: true, message: "Params empty"});
    }

    res.send(200, {movie: Movie[req.params.id]});
  });

  movieRouter.put(`${mountPoint}/:id`, (req, res) => {
    console.log("PUT:id ", req.params.id);
    if (!req.params.id && !req.body) {
      res.send(403, {error: true, message: "Params empty"});
    }

    let new_movie = req.body;
    new_movie._id = parseInt(req.params.id, 10);

    Movie[req.params.id] = new_movie;
    new_movie = Movie[req.params.id];

    res.send(200, {movie: new_movie});
  });

  movieRouter.applyRoutes(app.server);
};
