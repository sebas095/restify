const supertest = require('supertest');
const api = require('../app');
const host = api.server;
const request = supertest(host);
const config = require('../config/test');
const mongoose = require('mongoose');

describe('Auth route', () => {
  before(() => {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db.url);
  });

  after((done) => {
    mongoose.disconnect(done);
    mongoose.models = {};
  });
  describe('POST /', () => {
    it('should authenticate a user', (done) => {
      let user = {
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
        return request
          .post('/auth')
          .set('Accept', 'application/json')
          .send(user)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then((res) => {
        const {body} = res;
        expect(body).to.have.property('token');
        done();
      }, done);
    });
  });
});
