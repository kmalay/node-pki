const router = require('express').Router();
const authController = require('./authController');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('client-cert', { session: false });

// json processing
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ type: '*/*' })

router.get('/hello', (req, res) => {
  res.send({ msg: 'Hello World!' });
});

router.get('/hello-protected', requireAuth, (req, res) => {
  res.send({ msg: 'Super secret code is ABC123' });
});

router.post('/signin', jsonParser);
router.post('/signin', requireSignin, authController.signin);

router.post('/signup', jsonParser);
router.post('/signup', authController.signup);

module.exports = router;
