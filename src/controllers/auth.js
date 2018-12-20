const jwt = require('jwt-simple');
const db = require('../db');

const tokenForUser = user => {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.cn, iat: timestamp }, process.env.JWT_SECRET);
}

exports.signin = (req, res, next) => {
	// User has already had their email and password auth'd
	// We just need to give them a token
	res.send({
		token: tokenForUser(req.user),
		userId: req.user.id,
    firstName: req.user["first_name"],
		lastName: req.user["last_name"]
	});
}
