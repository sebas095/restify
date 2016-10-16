const supertest = require('supertest');
const api = require('../app');
const host = api.server;
const request = supertest(host);

// Scenarios
describe('Index route, Hello World', () => {
  // Expectations
  describe('GET /', () => {
    it('should return Hello World', (done) => {
      request
        .get('/')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      .end((err, res) => {
        const {body} = res;
        expect(body).to.have.property('message', 'Hello World');
        done(err);
      });
    });
  });
});
