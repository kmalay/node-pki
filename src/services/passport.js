const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const ClientCertStrategy = require('passport-client-cert').Strategy;
const db = require('../db');

// Create a function to lookup a user based on the PKI CN string
const lookupUser = (cn, done) => {
  db.query('select id, cn, first_name, last_name from users where cn = $1', [cn])
	  .then(response => {
      const user = response.rows[0] || null;
      done(null, user);
    })
	  .catch(e => console.error(e.stack))
}

// Create the PKI Strategy
const pkiLogin = new ClientCertStrategy((cert, done) => {
  const subject = cert.subject;
  let msg = 'Attempting PKI authentication';

  if (!subject) {
    console.log(`${msg} - no subject`);
    done(null, false);
  } else if (!subject.CN) {
    console.log(`${msg} - no client CN`);
    done(null, false);
  } else {
    const cn = subject.CN;

    lookupUser(cn, (err, user) => {
      msg = 'Authenticating ' +  cn + ' with certificate';

      if (!user) {
        console.log(`${msg} - user does not exist`);
        done(null, false);
      } else {
        console.log(`${msg} - user exists`);
        done(null, user);
      }
    });
  }
})

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromHeader('authorization'),
    ExtractJwt.fromUrlQueryParameter('token')
  ]),
	secretOrKey: process.env.JWT_SECRET
}

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// See if the user CN in the payload exists in our database
	// If it does, call 'done' with that user
	// otherwise, call 'done' without a user object
  db.query('select id, cn, first_name, last_name from users where cn = $1', [payload.sub])
	  .then(response => {
      const user = response.rows[0] || null;
      done(null, user);
    })
	  .catch(e => console.error(e.stack))
})

// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(pkiLogin);
