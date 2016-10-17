const supertest = require('supertest');
const api = require('../app');
const host = api.server;
const request = supertest(host);
const mongoose = require('mongoose');
const config = require('../config/test');
const _ = require('lodash');

describe('Movie route', () => {
  before(() => {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db.url);
  });

  after((done) => {
    mongoose.disconnect(done);
    mongoose.models = {};
  });

  describe('POST /movie', () => {
    it('should create a movie', (done) => {
      const user = {
        username: 'sebas095',
        password: 'secret123'
      };

      const movie = {
        title: 'batman vs superman',
        year: '2016'
      };

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then((res) => {
        let _user = res.body.user;
        _user.password = user.password;
        return request
          .post('/auth')
          .set('Accept', 'application/json')
          .send(_user)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        const {token} = res.body;
        return request
          .post('/movie')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send(movie)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done).then((res) => {
        const {body} = res;
        expect(body).to.have.property('movie');
        expect(body.movie).to.have.property('title', 'batman vs superman');
        expect(body.movie).to.have.property('year', '2016');
        expect(body.movie).to.have.property('_id');
        done();
      }, done);
    })
  });

  describe('GET /movie', () => {
    it('should return all movies', (done) => {
      let movie_id, movie2_id, token;

      const user = {
        username: 'sebas095',
        password: 'secret123'
      };

      const movie = {
        title: 'back to the future',
        year: '1985'
      };

      const movie2 = {
        title: 'back to the future II',
        year: '1989'
      };

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then((res) => {
        let _user = res.body.user;
        _user.password = user.password;
        return request
          .post('/auth')
          .set('Accept', 'application/json')
          .send(_user)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        token = res.body.token;
        return request
          .post('/movie')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send(movie)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        movie_id = res.body.movie._id;
        return request
          .post('/movie')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send(movie2)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        movie2_id = res.body.movie._id;
        return request
          .get('/movie')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })
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
      let movie_id, token;
      const movie = {
        title: 'Her',
        year: '2013'
      };

      const user = {
        username: 'sebas095',
        password: 'secret123'
      };

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then((res) => {
        let _user = res.body.user;
        _user.password = user.password;
        return request
          .post('/auth')
          .set('Accept', 'application/json')
          .send(_user)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        token = res.body.token;
        return request
          .post('/movie')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send(movie)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        movie_id = res.body.movie._id;
        return request
          .get('/movie/' + movie_id)
          .set('Accept', 'application/json')
          .set('x-access-token', token)
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

  describe('PUT /movie/:id', () => {
    it('should modifies a movie', (done) => {
      let movie_id, token;
      const movie = {
        title: 'Pulp Fiction',
        year: '1993'
      };

      const user = {
        username: 'sebas095',
        password: 'secret123'
      };

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then((res) => {
        let _user = res.body.user;
        _user.password = user.password;
        return request
          .post('/auth')
          .set('Accept', 'application/json')
          .send(_user)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        token = res.body.token;
        return request
          .post('/movie')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send(movie)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        movie_id = res.body.movie._id;
        return request
          .put('/movie/' + movie_id)
          .send(movie)
          .set('Accept', 'application/json')
          .set('x-access-token', token)
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

      const user = {
        username: 'sebas095',
        password: 'secret123'
      };

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then((res) => {
        let _user = res.body.user;
        _user.password = user.password;
        return request
          .post('/auth')
          .set('Accept', 'application/json')
          .send(_user)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        token = res.body.token;
        return request
          .post('/movie')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send(movie)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        movie_id = res.body.movie._id;
        return request
          .delete('/movie/' + movie_id)
          .set('Accept', 'application/json')
          .set('x-access-token', token)
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
