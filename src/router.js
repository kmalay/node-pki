const passportService = require('./components/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = app => {
  app.get('/', (req, res) => {
    res.send({ msg: 'Hello World!' });
  });

  app.use('/auth', require('./components/auth/authAPI'));
}
