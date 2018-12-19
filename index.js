const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const passport = require('passport');
const ClientCertStrategy = require('passport-client-cert').Strategy;

const PORT = 4433;

// A list of valid user IDs
// client1 is in the list, so requests with that cert will be authorized.
// client2 is not in the list, so that certs will be denied.
var users = ['client1'];

/*
 * Dummy user lookup method - simulates database lookup
 */
const lookupUser = (cn, done) => {
  const user = users.indexOf(cn) >= 0 ? { username: cn } : null;
  done(null, user);
}

/**
 * Authentication callback for PKI authentication
 *  - Look up a user by ID (which, in this simple case, is identical
 *    to the certificate's Common Name attribute).
 */
const authenticate = (cert, done) => {
  const subject = cert.subject;
  let msg = 'Attempting PKI authentication';

  if(!subject) {
    console.log(`${msg} - no subject`);
    done(null, false);
  } else if(!subject.CN) {
    console.log(`${msg} - no client CN`);
    done(null, false);
  } else {
    const cn = subject.CN;

    lookupUser(cn, (err, user) => {
      msg = 'Authenticating ' +  cn + ' with certificate';

      if(!user) {
        console.log(`${msg} - user does not exist`);
        done(null, false);
      } else {
        console.log(`${msg} - user exists`);
        done(null, user);
      }
    });
  }
}

const certDir = path.join(__dirname, 'certs');

var options = {
  key: fs.readFileSync(path.join(certDir, 'server-key.pem')),
  cert: fs.readFileSync(path.join(certDir, 'server-crt.pem')),
  ca: fs.readFileSync(path.join(certDir, 'ca-crt.pem')),
  requestCert: true,
  rejectUnauthorized: true
};

passport.use(new ClientCertStrategy(authenticate));

const app = express();
app.use(passport.initialize());
app.use(passport.authenticate('client-cert', { session: false }));
app.get('/', (req, res) => {
  res.end(JSON.stringify(req.user));
});

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
