const passportService = require('./components/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = app => {
  app.get('/', (req, res) => {
    res.send({ msg: 'Hello World!' });
  });

  app.get('/protected', requireAuth, (req, res) => {
    res.send({ message: 'This is a protected route.' });
  });

  app.use('/auth', require('./components/auth/authAPI'));
}
