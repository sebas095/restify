const supertest = require('supertest');
const api = require('../app');
const host = api.server;
const request = supertest(host);
const _ = require('lodash');

describe('Movie route', () => {
  describe('POST /movie', () => {
    it('should create a movie', (done) => {
      const movie = {
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
      const movie = {
        title: 'back to the future',
        year: '1985'
      };
      const movie2 = {
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

  describe('GET /movie/:id', () => {
    it('should return a movie', (done) => {
      let movie_id;
      const movie = {
        title: 'Her',
        year: '2013'
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
          .get('/movie/' + movie_id)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        const {body} = res;
        expect(body).to.have.property('movie');
        expect(body.movie).to.have.property('_id', movie_id);
        expect(body.movie).to.have.property('title', 'Her');
        expect(body.movie).to.have.property('year', '2013');
        done();
      }, done);
    });
  });

  describe('PUT /movie', () => {
    it('should modifies a movie', (done) => {
      let movie_id;
      const movie = {
        title: 'Pulp Fiction',
        year: '1993'
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
          .put('/movie/' + movie_id)
          .send(movie)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        const {body} = res;
        expect(body).to.have.property('movie');
        expect(body.movie).to.have.property('_id', movie_id);
        expect(body.movie).to.have.property('title', 'Pulp Fiction');
        expect(body.movie).to.have.property('year', '1993');
        done();
      }, done);
    });
  });

  describe('DELETE /movie/:id', () => {
    it('should remove a movie', (done) => {
      let movie_id;
      const movie = {
        title: 'Pulp Fiction',
        year: '1993'
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
          .delete('/movie/' + movie_id)
          .set('Accept', 'application/json')
          .expect(400)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        const {body} = res;
        expect(body).to.be.empty;
        done();
      }, done);
    });
  });
});
