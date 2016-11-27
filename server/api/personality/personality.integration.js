'use strict';

var app = require('../..');
import request from 'supertest';

var newPersonality;

describe('Personality API:', function() {
  describe('GET /api/personalitys', function() {
    var personalitys;

    beforeEach(function(done) {
      request(app)
        .get('/api/personalitys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          personalitys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(personalitys).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/personalitys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/personalitys')
        .send({
          name: 'New Personality',
          info: 'This is the brand new personality!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPersonality = res.body;
          done();
        });
    });

    it('should respond with the newly created personality', function() {
      expect(newPersonality.name).to.equal('New Personality');
      expect(newPersonality.info).to.equal('This is the brand new personality!!!');
    });
  });

  describe('GET /api/personalitys/:id', function() {
    var personality;

    beforeEach(function(done) {
      request(app)
        .get(`/api/personalitys/${newPersonality._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          personality = res.body;
          done();
        });
    });

    afterEach(function() {
      personality = {};
    });

    it('should respond with the requested personality', function() {
      expect(personality.name).to.equal('New Personality');
      expect(personality.info).to.equal('This is the brand new personality!!!');
    });
  });

  describe('PUT /api/personalitys/:id', function() {
    var updatedPersonality;

    beforeEach(function(done) {
      request(app)
        .put(`/api/personalitys/${newPersonality._id}`)
        .send({
          name: 'Updated Personality',
          info: 'This is the updated personality!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPersonality = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPersonality = {};
    });

    it('should respond with the original personality', function() {
      expect(updatedPersonality.name).to.equal('New Personality');
      expect(updatedPersonality.info).to.equal('This is the brand new personality!!!');
    });

    it('should respond with the updated personality on a subsequent GET', function(done) {
      request(app)
        .get(`/api/personalitys/${newPersonality._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let personality = res.body;

          expect(personality.name).to.equal('Updated Personality');
          expect(personality.info).to.equal('This is the updated personality!!!');

          done();
        });
    });
  });

  describe('PATCH /api/personalitys/:id', function() {
    var patchedPersonality;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/personalitys/${newPersonality._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Personality' },
          { op: 'replace', path: '/info', value: 'This is the patched personality!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPersonality = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPersonality = {};
    });

    it('should respond with the patched personality', function() {
      expect(patchedPersonality.name).to.equal('Patched Personality');
      expect(patchedPersonality.info).to.equal('This is the patched personality!!!');
    });
  });

  describe('DELETE /api/personalitys/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/personalitys/${newPersonality._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when personality does not exist', function(done) {
      request(app)
        .delete(`/api/personalitys/${newPersonality._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
