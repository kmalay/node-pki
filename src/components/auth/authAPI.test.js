const fs = require('fs');
const path = require('path');
const db = require('../db');
let token;

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

describe('Test /auth', () => {
  beforeEach(() => {
    // get a valid token and store globally for tests
    return agent1
      .post('/auth/signin')
      .then(res => {
        const x = JSON.parse(res.text).token;
        token = x;
      })
      .catch(err => {
        console.error(err);
      })
  });

  describe('Test /auth/hello', () => {
    describe('GET /auth/hello', () => {
      it('should be able to consume the route /hello', async () => {
        const res = await agent1
          .get('/auth/hello')
          .expect(200);
        const { msg } = JSON.parse(res.text);
        expect(msg).toEqual('Hello World!');
      });
    });
  });

  describe('Test /auth/hello-protected', () => {
    describe('GET /auth/hello-protected', () => {
      it('should be able to consume the route /hello-protected with a valid JWT', async () => {
        const res = await agent1
          .get('/auth/hello-protected')
          .set('Authorization', token)
          .expect(200)
        const { msg } = JSON.parse(res.text);
        expect(msg).toEqual('Super secret code is ABC123');
      });
    });
  });

  describe('Test /auth/signin', () => {
    describe('POST /auth/signin', () => {
      it('should be able to signin with a valid PKI and a user account', async () => {
        const res = await agent1
          .post('/auth/signin')
          .expect(200)
        const t = JSON.parse(res.text).token;
        expect(typeof t).toBe('string');
      });

      it('should NOT be able to signin with a valid PKI but no user account', async () => {
        const res = await agent2
          .post('/auth/signin')
          .expect(401)
        const response = res.text;
        expect(response).toEqual('Unauthorized');
      });
    });
  });

  describe('Test /auth/signup', () => {
    describe('POST /auth/signup', () => {
      it('should NOT be able to signup without the required fields', async () => {
        const user = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: null
        };

        const res = await agent1
          .post('/auth/signup')
          .send(user)
          .type('json')
          .expect(422)
        const { error } = res.body;
        expect(error).toEqual('You must provide email, first name, last name, and phone number.');
      });

      it('should be able to signup with the required fields', async () => {
        const user = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '555-555-5555'
        };

        const response = await db.query(`delete from signup where email like 'john.doe%' `)
        const res = await agent1
          .post('/auth/signup')
          .send(user)
          .type('json')
          .expect(200)
        const result = res.text;
        expect(result).toEqual('Account request created');
      });
    });
  });
});
