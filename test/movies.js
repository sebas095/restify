const supertest = require('supertest');
const api = require('../app');
const host = api.server;
const request = supertest(host);

describe('Movie route', () => {
  describe('Request to post', () => {
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
});
