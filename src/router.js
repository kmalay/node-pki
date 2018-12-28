const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ type: '*/*' })
const AuthController = require('./controllers/auth');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('client-cert', { session: false });

module.exports = app => {
  app.get('/', requireAuth, (req, res) => {
    res.send({ message: 'Super secret code is ABC123' });
  });

  app.post('/signin', jsonParser);
  app.post('/signin', requireSignin, AuthController.signin);

  app.post('/signup', jsonParser);
  app.post('/signup', AuthController.signup);
}
