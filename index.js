// Load environment variables first
require('dotenv').config({silent: true});

const fs = require('fs');
const path = require('path');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const ClientCertStrategy = require('passport-client-cert').Strategy;
const router = require('./src/router');
const db = require('./src/db');

const certDir = path.join(__dirname, 'certs');

var options = {
  key: fs.readFileSync(path.join(certDir, 'server-key.pem')),
  cert: fs.readFileSync(path.join(certDir, 'server-crt.pem')),
  ca: fs.readFileSync(path.join(certDir, 'ca-crt.pem')),
  requestCert: true,
  rejectUnauthorized: false
};

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(passport.initialize());

router(app);

const port = process.env.PORT || 4433;
const server = https.createServer(options, app);

server.listen(port);
console.log(`Server listening on port: ${port}`);

module.exports = app;
