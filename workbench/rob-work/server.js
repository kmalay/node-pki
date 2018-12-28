const fs = require('fs');
const https = require('https');
const express = require('express');

var options = {
  key: fs.readFileSync('certs/server-key.pem'),
  cert: fs.readFileSync('certs/server-crt.pem'),
  ca: fs.readFileSync('certs/ca-crt.pem'),
  requestCert: true,
  rejectUnauthorized: false
};

const app = express();

app.get('/', (req, res) => res.send('Hello World!'))

const port = process.env.PORT || 4433;
const server = https.createServer(options, app);

server.listen(port);
console.log(`Server listening on port: ${port}`);

module.exports = app;
