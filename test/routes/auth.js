const fs = require('fs');
const path = require('path');

describe('Routes: auth', () => {

  const certDir = 'certs';
  const caCert = fs.readFileSync(path.join(certDir, 'ca-crt.pem'));
  const certClient1 = fs.readFileSync(path.join(certDir, 'client1.p12'));
  const certClient2 = fs.readFileSync(path.join(certDir, 'client2.p12'));
  const clientCert = fs.readFileSync(path.join(certDir, 'client1-crt.pem'));
  const clientKey = fs.readFileSync(path.join(certDir, 'client1-key.pem'));

  describe('POST /signin', () => {
    it('should be able to signin with a valid PKI and a user account', done => {
      const options = {
        pfx: certClient1,
        passphrase: 'password',
        ca: caCert,
        agentOptions: {
          cert: clientCert,
          key: clientKey,
          pfx: certClient1,
          passphrase: 'password',
          ca: caCert
        }
      };

      request
        .post('/signin', options)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          var response = JSON.parse(res.text);
          expect(response.length).to.equal(1);
          done();
        });

      // request
      //   .post('/signin')
      //   .pfx(certClient1)
      //   .ca(caCert)
      //   .expect(200)
      //   .end((err, res) => {
      //     if (err) return done(err);
      //     var response = JSON.parse(res.text);
      //     expect(response.length).to.equal(1);
      //     done();
      //   });
    });
  });


  describe('POST /signin', () => {
    it('should NOT be able to signin with a valid PKI but no user account', done => {
      const options = {
        uri: 'https://localhost:4433/signin',
        pfx: certClient2,
        passphrase: 'password',
        ca: caCert,
        agentOptions: {
          pfx: certClient2,
          passphrase: 'password',
          ca: caCert,
          securityOptions: 'SSL_OP_NO_SSLv3'
        }
      };

      request
        .post('/signin')
        .pfx(certClient2)
        .ca(caCert)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          var response = res.text;
          expect(response).to.equal('Unauthorized');
          done();
        });
    });
  });

});
