const fs = require('fs');
const path = require('path');
const https = require('https');
const app = require('./app')

// SSL Options
const certDir = path.join(__dirname, 'certs');

var options = {
  key: fs.readFileSync(path.join(certDir, 'server-key.pem')),
  cert: fs.readFileSync(path.join(certDir, 'server-crt.pem')),
  ca: fs.readFileSync(path.join(certDir, 'ca-crt.pem')),
  requestCert: true,
  rejectUnauthorized: false
};

// Server Setup
const port = process.env.PORT || 4433;
const server = https.createServer(options, app);
server.listen(port);
console.log(`Server listening on: ${port}`);
