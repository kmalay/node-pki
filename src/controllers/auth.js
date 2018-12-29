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

exports.signup = (req, res, next) => {
	// Grab the user properties off of the request.
	const { firstName, lastName, phoneNumber } = req.body;
	const cn = req.connection.getPeerCertificate().subject.CN;
	let email = req.body.email;
	email = email.toLowerCase();

	// Check for CN string
	if (!cn) {
		return res.status(422).send({
			error: 'You must have a valid certificate.'
		})
	}

	// Check for null required fields
	if (!email || !firstName || !lastName || !phoneNumber) {
		return res.status(422).send({
			error: 'You must provide email, first name, last name, and phone number.'
		});
	}

	// Check to see if a signup record exists with the same email
	db.query('select * from signup where email = $1', [email])
	  .then(response => {
      if (response.rows && response.rows.length > 0) {
				// console.log('Got existing user', email);
				return res.status(422).send({ error: 'Email is already in use.' });
			}

			// If record does not exist then create it
			const values = [cn, firstName, lastName, email, phoneNumber];
			const sql = `
				insert into signup (cn, first_name, last_name, email, phone_number)
				values ($1, $2, $3, $4, $5)
			`;

			db.query(sql, values)
			  .then(response => {
					// console.log(response.rows[0]);
		      res.end('Account request created');
		    })
				.catch(e => console.error(e.stack))
    })
	  .catch(e => console.error(e.stack))
}
