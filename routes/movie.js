const {Router} = require('restify-router');
const movieRouter = new Router();
const Movie = require('../models/movie');

module.exports = (app, mountPoint) => {
  movieRouter.get(`${mountPoint}/`, (req, res) => {
    console.log("GET: ", req.body);
    Movie.find().then((movies) => {
      res.send(200, {movies: movies});
    }).catch((err) => {
      res.send(500, {error: true, message: "Internal server problem"});
    });
  });

  movieRouter.post(`${mountPoint}/`, (req, res) => {
    console.log("POST", req.body);
    if (!req.body) {
      res.send(403, {error: true, message: "Body empty"});
    }

    Movie.create(req.body).then((movie) => {
      res.send(201, {movie: movie});
    }).catch((err) => {
      res.send(501, {message: "Problem creating the movie"});
    });
  });

  movieRouter.get(`${mountPoint}/:id`, (req, res) => {
    console.log("GET:id ", req.params.id);
    if (!req.params.id) {
      res.send(403, {error: true, message: "Params empty"});
    }

    Movie.findOne({_id: req.params.id}).then((movie) => {
      res.send(200, {movie: movie});
    }).catch((err) => {
      res.send(500, {error: true, message: "Internal server problem"});
    });
  });

  movieRouter.put(`${mountPoint}/:id`, (req, res) => {
    console.log("PUT:id ", req.params.id);
    if (!req.params.id && !req.body) {
      res.send(403, {error: true, message: "Request empty"});
    }

    Movie.findByIdAndUpdate(req.params.id, req.body, {new: true}).then((movie) => {
      res.send(200, {movie: movie});
    }).catch((err) => {
      res.send(500, {error: true, message: "Internal server problem"});
    });
  });

  movieRouter.del(`${mountPoint}/:id`, (req, res) => {
    console.log("DELETE:id ", req.params.id);
    if (!req.params.id) {
      res.send(403, {error: true, message: "Params empty"});
    }

    Movie.findByIdAndRemove(req.params.id).then(() => {
      res.send(400, {});
    }).catch((err) => {
      res.send(403, {error: true, message: "Request empty"});
    });
  });

  movieRouter.applyRoutes(app.server);
};
