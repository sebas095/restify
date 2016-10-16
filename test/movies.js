const supertest = require('supertest');
const api = require('../app');
const host = api.server;
const request = supertest(host);
const _ = require('lodash');

describe('Movie route', () => {
  describe('POST /movie', () => {
    it('should create a movie', (done) => {
      let movie = {
        title: 'back to the future',
        year: '1985'
      };

      request
        .post('/movie')
        .set('Accept', 'application/json')
        .send(movie)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .end((err, res) => {
        const {body} = res;
        expect(body).to.have.property('movie');
        expect(body.movie).to.have.property('title', 'back to the future');
        expect(body.movie).to.have.property('year', '1985');
        expect(body.movie).to.have.property('_id');
        done(err);
      });
    })
  });

  describe('GET /movie', () => {
    it('should return all movies', (done) => {
      let movie_id, movie2_id;
      let movie = {
        title: 'back to the future',
        year: '1985'
      };
      let movie2 = {
        title: 'back to the future II',
        year: '1989'
      };

      request
        .post('/movie')
        .set('Accept', 'application/json')
        .send(movie)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then((res) => {
        movie_id = res.body.movie._id;
        return request
          .post('/movie')
          .set('Accept', 'application/json')
          .send(movie2)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      })
      .then((res) => {
        movie2_id = res.body.movie._id;
        return request
          .get('/movie')
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        const {body} = res;
        expect(body).to.have.property('movies');
        expect(body.movies).to.be.an('array')
          .and.to.have.length.above(2);

        const {movies} = body;
        const movie = _.find(movies, {_id:  movie_id});
        const movie2 = _.find(movies, {_id:  movie2_id});

        expect(movie).to.have.property('_id', movie_id);
        expect(movie).to.have.property('title', 'back to the future');
        expect(movie).to.have.property('year', '1985');

        expect(movie2).to.have.property('_id', movie2_id);
        expect(movie2).to.have.property('title', 'back to the future II');
        expect(movie2).to.have.property('year', '1989');

        done();
      }, done);
    });
  });
});
