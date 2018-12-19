# NodeJS app w/ PKI authentication

This is a small example of using PKI certificates to authenticate with a NodeJS app using PassportJS.

### To run this example:
1. Clone this repo.
```sh
git clone git@github.com:kmalay/node-pki.git
```
2. Install dependencies with [Yarn](https://yarnpkg.com) or [NPM](https://www.npmjs.com/).
```sh
yarn
```
or
```sh
npm install
```
3. Run the app.
```sh
yarn start
```
or
```sh
npm start
```
4. Test it out.
```sh
curl --insecure --cert client1.p12:password --cert-type p12 https://localhost:4433
curl --insecure --cert client2.p12:password --cert-type p12 https://localhost:4433
```

The request with `client1.p12` will be allowed, and the request with `client2.p12` will be denied.

If you take a look at the [index.js](index.js) file, you'll see why.  `client1` is in the list of approved users but `client2` is not.
