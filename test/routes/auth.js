const fs = require('fs');
const path = require('path');

const options1 = {
  ca: fs.readFileSync('certs/ca-crt.pem'),
  key: fs.readFileSync('certs/client1-key.pem'),
  cert: fs.readFileSync('certs/client1-crt.pem')
};
const agent1 = require('supertest').agent('https://localhost:4433', options1);

const options2 = {
  ca: fs.readFileSync('certs/ca-crt.pem'),
  key: fs.readFileSync('certs/client2-key.pem'),
  cert: fs.readFileSync('certs/client2-crt.pem')
};
const agent2 = require('supertest').agent('https://localhost:4433', options2);


describe('Routes: auth', () => {
  describe('POST /signin', () => {
    it('should be able to signin with a valid PKI and a user account', done => {
      agent1
        .post('/signin')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          const token = JSON.parse(res.text).token;
          expect(token).to.be.a('string');
          done();
        });
    });
  });

  describe('POST /signin', () => {
    it('should NOT be able to signin with a valid PKI but no user account', done => {
      agent2
        .post('/signin')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          var response = res.text;
          expect(response).to.equal('Unauthorized');
          done();
        });
    });
  });

  describe('POST /signup', () => {
    it('should NOT be able to signup without the required fields', done => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: null
      };

      agent1
        .post('/signup')
        .send(user)
        .set('Accept', 'application/json')
        .expect(422)
        .end((err, res) => {
          if (err) return done(err);
          var response = JSON.parse(res.text).error;
          expect(response).to.equal('You must provide email, first name, last name, and phone number.');
          done();
        });
    });
  });

  describe('POST /signup', () => {
    it('should be able to signup without the required fields', done => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '555-555-5555'
      };

      agent1
        .post('/signup')
        .send(user)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          var response = res.text;
          expect(response).to.equal('Account request created');
          done();
        });
    });
  });
});
