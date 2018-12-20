// Load environment variables first
require('dotenv').config({silent: true});

const fs = require('fs');
const path = require('path');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const ClientCertStrategy = require('passport-client-cert').Strategy;
const router = require('./src/router');
const db = require('./src/db');

// const lookupUser = (cn, done) => {
//   db.query('select id, first_name, last_name from users where cn = $1', [cn])
// 	  .then(response => {
//       const user = response.rows[0] || null;
//       done(null, user);
//     })
// 	  .catch(e => console.error(e.stack))
// }

/**
 * Authentication callback for PKI authentication
 *  - Look up a user by CN.
 */
// const authenticate = (cert, done) => {
//   const subject = cert.subject;
//   let msg = 'Attempting PKI authentication';
//
//   if(!subject) {
//     console.log(`${msg} - no subject`);
//     done(null, false);
//   } else if(!subject.CN) {
//     console.log(`${msg} - no client CN`);
//     done(null, false);
//   } else {
//     const cn = subject.CN;
//
//     lookupUser(cn, (err, user) => {
//       msg = 'Authenticating ' +  cn + ' with certificate';
//
//       if(!user) {
//         console.log(`${msg} - user does not exist`);
//         done(null, false);
//       } else {
//         console.log(`${msg} - user exists`);
//         done(null, user);
//       }
//     });
//   }
// }

const certDir = path.join(__dirname, 'certs');

var options = {
  key: fs.readFileSync(path.join(certDir, 'server-key.pem')),
  cert: fs.readFileSync(path.join(certDir, 'server-crt.pem')),
  ca: fs.readFileSync(path.join(certDir, 'ca-crt.pem')),
  requestCert: true,
  rejectUnauthorized: true
};

// passport.use(new ClientCertStrategy(authenticate));

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(passport.initialize());
// app.use(passport.authenticate('client-cert', { session: false }));

router(app);

const port = process.env.PORT || 4433;
const server = https.createServer(options, app);

server.listen(port);
console.log(`Server listening on port: ${port}`);

module.exports = app;
