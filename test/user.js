const supertest = require('supertest');
const api = require('../app');
const host = api.server;
const request = supertest(host);
const mongoose = require('mongoose');
const config = require('../config/test');

describe('User route', () => {
  before(() => {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db.url);
  });

  after((done) => {
    mongoose.disconnect(done);
    mongoose.models = {};
  });

  describe('POST /user', () => {
    it('should create a new user', (done) => {
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
      .end((err, res) => {
        const {body} = res;
        expect(body).to.have.property('user', 'sebas095');
        done(err);
      });
    });
  });
});
