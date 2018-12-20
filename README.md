# NodeJS app w/ PKI authentication

This is a small example of using PKI certificates to authenticate with a NodeJS app using PassportJS.

### To run this example:
1. Clone this repo.
```sh
git clone git@github.com:kmalay/node-pki.git
cd node-pki
```
2. Create a local Postgres db called `bridge`.
```sh
createdb bridge
```
3. Install default db objects and test data.
```sh
psql -f db/install.sql bridge
```
4. Install dependencies with [Yarn](https://yarnpkg.com) or [NPM](https://www.npmjs.com/).
```sh
yarn
```
```sh
npm install
```
5. Create an `.env` file that contains the following.
**Note:** Feel free to replace the `abc123` with any random alphanumeric string.  This is a secret key used to encode the Javascript Web Tokens for establishing a user session.
```sh
JWT_SECRET=abc123
```
6. Run the app.
```sh
yarn start
```
```sh
npm start
```
7. Test it out.
```sh
curl --insecure --cert certs/client1.p12:password --cert-type p12 -X POST https://localhost:4433/signin
curl --insecure --cert certs/client2.p12:password --cert-type p12 -X POST https://localhost:4433/signin
```
The request with `client1.p12` will be allowed, and the request with `client2.p12` will be denied.  
If you take a look at the `users` table in the `bridge` db you created in step 2 above, you'll see why.  `client1` has an account in the table and `client2` does not.
