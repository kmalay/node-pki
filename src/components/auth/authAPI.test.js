const fs = require('fs');
const path = require('path');
const db = require('../db');

const options1 = {
  ca: fs.readFileSync('src/certs/ca-crt.pem'),
  key: fs.readFileSync('src/certs/client1-key.pem'),
  cert: fs.readFileSync('src/certs/client1-crt.pem')
};
const agent1 = require('supertest').agent('https://localhost:4433', options1);

const options2 = {
  ca: fs.readFileSync('src/certs/ca-crt.pem'),
  key: fs.readFileSync('src/certs/client2-key.pem'),
  cert: fs.readFileSync('src/certs/client2-crt.pem')
};
const agent2 = require('supertest').agent('https://localhost:4433', options2);


describe('Test /auth/hello', () => {

  describe('GET /auth/hello', () => {
    it('should be able to consume the route /hello', done => {
      agent2
        .get('/')
        .expect(200)
        .then(res => {
          expect(res.body.msg).toEqual('Hello World!');
          done();
        })
        .catch(err => done(err))
    });
  });
});


describe('Test /auth/signin', () => {

  describe('POST /auth/signin', () => {
    it('should be able to signin with a valid PKI and a user account', done => {
      agent1
        .post('/auth/signin')
        .expect(200)
        .then(res => {
          const token = JSON.parse(res.text).token;
          expect(typeof token).toBe('string');
          done();
        })
        .catch(err => done(err))
    });

    it('should NOT be able to signin with a valid PKI but no user account', done => {
      agent2
        .post('/auth/signin')
        .expect(401)
        .then(res => {
          const response = res.text;
          expect(response).toEqual('Unauthorized');
          done();
        })
        .catch(err => done(err))
    });
  });

});


describe('Test /auth/signup', () => {

  describe('POST /auth/signup', () => {
    it('should NOT be able to signup without the required fields', done => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: null
      };

      agent1
        .post('/auth/signup')
        .send(user)
        .set('Accept', 'application/json')
        .expect(422)
        .then(res => {
          const response = JSON.parse(res.text).error;
          expect(response).toEqual('You must provide email, first name, last name, and phone number.');
          done();
        })
        .catch(err => done(err))
    });

    it('should be able to signup with the required fields', done => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '555-555-5555'
      };

      db.query(`delete from signup where email like 'john.doe%' `)
        .then(response => {
          agent1
            .post('/auth/signup')
            .send(user)
            .set('Accept', 'application/json')
            .expect(200)
            .then(res => {
              const response = res.text;
              expect(response).toEqual('Account request created');
              done()
            })
            .catch(err => done(err))
        })
        .catch(err => done(err))
    });
  });

});
